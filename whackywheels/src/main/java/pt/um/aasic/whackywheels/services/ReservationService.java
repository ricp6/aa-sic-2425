package pt.um.aasic.whackywheels.services;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import pt.um.aasic.whackywheels.dtos.*;
import pt.um.aasic.whackywheels.dtos.participant.ParticipantCreateDTO;
import pt.um.aasic.whackywheels.dtos.participant.ParticipantResponseDTO;
import pt.um.aasic.whackywheels.dtos.participant.ParticipantUpdateDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationDetailsResponseDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationResponseDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationUpdateRequestDTO;
import pt.um.aasic.whackywheels.dtos.session.SessionCreateDTO;
import pt.um.aasic.whackywheels.dtos.session.SimpleSessionResponseDTO;
import pt.um.aasic.whackywheels.dtos.track.SlotResponseDTO;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final KartRepository kartRepository;
    private final SessionRepository sessionRepository;
    private final ParticipantRepository participantRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final NotificationService notificationService;

    public ReservationService(ReservationRepository reservationRepository,
                              TrackRepository trackRepository,
                              UserRepository userRepository,
                              KartRepository kartRepository,
                              SessionRepository sessionRepository,
                              ParticipantRepository participantRepository,
                              DayScheduleRepository dayScheduleRepository,
                              NotificationService notificationService) {
        this.reservationRepository = reservationRepository;
        this.trackRepository = trackRepository;
        this.userRepository = userRepository;
        this.kartRepository = kartRepository;
        this.sessionRepository = sessionRepository;
        this.participantRepository = participantRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ReservationDetailsResponseDTO createReservation(ReservationCreateRequestDTO request, Long currentUserId) {

        Track track = trackRepository.findById(request.getTrackId())
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + request.getTrackId()));

        if (!track.getIsAvailable()) {
            throw new IllegalArgumentException("Track is not available.");
        }


        DayOfWeek reservationDayOfWeek = request.getReservationDate().getDayOfWeek();
        DaySchedule trackSchedule = dayScheduleRepository.findByTrackAndDay(track, reservationDayOfWeek)
                .orElseThrow(() -> new IllegalArgumentException("Track is not open on " + reservationDayOfWeek.name() + "."));


        Reservation reservation = new Reservation();
        reservation.setDate(request.getReservationDate());
        reservation.setTrack(track);
        reservation.setStatus(ReservationStatus.PENDING);

        reservation.setCreatedByUserId(currentUserId);

        LocalDate reservationDate = request.getReservationDate();

        Set<Session> sessions = new HashSet<>();
        for (SessionCreateDTO sessionDTO : request.getSessions()) {
            LocalDateTime sessionStartTime = LocalDateTime.of(reservationDate, sessionDTO.getStartTime());
            LocalDateTime sessionEndTime = LocalDateTime.of(reservationDate, sessionDTO.getEndTime());

            // Validações de horário da sessão:
            // a) Horário da sessão dentro do horário de funcionamento da pista para o dia
            if (sessionStartTime.toLocalTime().isBefore(trackSchedule.getOpeningTime()) ||
                    sessionEndTime.toLocalTime().isAfter(trackSchedule.getClosingTime())) {
                throw new IllegalArgumentException("Session times are outside track's operating hours for " + reservationDayOfWeek.name() + ".");
            }
            // b) Hora de início antes da hora de fim
            if (sessionStartTime.isAfter(sessionEndTime) || sessionStartTime.isEqual(sessionEndTime)) {
                throw new IllegalArgumentException("Session start time must be before end time.");
            }
            // c)garantir que o slot não está ocupado ( apesar de já estar filtrado no frontend)
            List<Session> existingOccupiedSessions = sessionRepository.findOccupiedSessionsForTrackAndDate(
                    track.getId(),
                    reservationDate,
                    ReservationStatus.PENDING,
                    ReservationStatus.ACCEPTED
            );
            for (Session existingSession : existingOccupiedSessions) {
                if (sessionStartTime.toLocalTime().isBefore(existingSession.getBookedEndTime()) &&
                        sessionEndTime.toLocalTime().isAfter(existingSession.getBookedStartTime())) {
                throw new IllegalArgumentException("Session times overlap with an existing reservation.");
                }
            }

            Session session = new Session(sessionStartTime.toLocalTime(), sessionEndTime.toLocalTime(), reservation, null, null);
            sessions.add(session);
        }
        reservation.setSessions(sessions);

        Set<Participant> participants = new HashSet<>();
        boolean currentUserIdIsParticipant = false;
        for (ParticipantCreateDTO participantDTO : request.getParticipants()) {
            User user = userRepository.findById(participantDTO.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found for participant with ID: " + participantDTO.getUserId()));
                if (user.getId().equals(currentUserId)) {
                currentUserIdIsParticipant = true;
            }
            Kart kart = null;
            if (participantDTO.getKartId() != null) {
                kart = kartRepository.findById(participantDTO.getKartId())
                        .orElseThrow(() -> new IllegalArgumentException("Kart not found with ID: " + participantDTO.getKartId()));

                if (!kart.getTrack().equals(track)) {
                    throw new IllegalArgumentException("Kart with ID " + kart.getId() + " does not belong to this track.");
                }
                //ver se o kart está disponível
                if (!kart.getIsAvailable()) {
                    throw new IllegalArgumentException("Kart with ID " + kart.getId() + " is not available.");
                }

            }

            Participant participant = new Participant(user, kart, reservation);
            participants.add(participant);
        }
        if (!track.getOwner().getId().equals(currentUserId) && !currentUserIdIsParticipant) {
                throw new IllegalArgumentException("Current user is not a participant in this reservation.");
        }
        reservation.setParticipants(participants);


        Reservation savedReservation = reservationRepository.save(reservation);
        sessionRepository.saveAll(sessions);
        participantRepository.saveAll(participants);


        // 7. Enviar notificação para o user que fez a resetva
        User bookingUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Booking user not found with ID: " + currentUserId));

        String notificationTitle = "Reservation #" + savedReservation.getId() + " created";
        String notificationBody = String.format("Your reservation on track '%s' to %s is %s.",
                track.getName(),
                request.getReservationDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE),
                savedReservation.getStatus().name());

        NotificationCreateRequestDTO bookingNotificationRequest = new NotificationCreateRequestDTO();
        bookingNotificationRequest.setUserId(bookingUser.getId());
        bookingNotificationRequest.setTitle(notificationTitle);
        bookingNotificationRequest.setBody(notificationBody);
        notificationService.createNotification(bookingNotificationRequest);

        for (Participant participant : participants) {
            if (!participant.getUser().equals(bookingUser)) {
                String participantNotificationTitle = "Confirmed your participation in reserve #" + savedReservation.getId();
                String participantNotificationBody = String.format("You've been added to the reservation %s in the track '%s' to %s.",
                        savedReservation.getId(),
                        track.getName(),
                        request.getReservationDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
            }
        }

        // 8. Mapear para ReservationResponseDTO
        List<SimpleSessionResponseDTO> sessionResponses = savedReservation.getSessions().stream()
                .map(session -> new SimpleSessionResponseDTO(session.getId(), session.getBookedStartTime(), session.getBookedEndTime(), null, null))
                .collect(Collectors.toList());

        List<ParticipantResponseDTO> participantResponses = savedReservation.getParticipants().stream()
                .map(participant -> new ParticipantResponseDTO(
                        participant.getId(),
                        participant.getUser().getId(),
                        participant.getUser().getName(),
                        participant.getKart() != null ? participant.getKart().getId() : null,
                        participant.getKart() != null ? participant.getKart().getKartNumber() : null
                ))
                .collect(Collectors.toList());

        long totalSessionDurationMinutes = savedReservation.getSessions().stream()
            .mapToLong(session -> java.time.Duration.between(session.getBookedStartTime(), session.getBookedEndTime()).toMinutes())
            .sum();
        double price = calculateSessionCost(savedReservation, totalSessionDurationMinutes);
        long creatorId = savedReservation.getCreatedByUserId() != null ? savedReservation.getCreatedByUserId() : currentUserId;
        return new ReservationDetailsResponseDTO(
                savedReservation.getId(),
                savedReservation.getDate(),
                savedReservation.getStatus(),
                savedReservation.getTrack().getId(),
                savedReservation.getTrack().getName(),
                sessionResponses,
                participantResponses,
                price,
                creatorId
        );
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getReservationsByUserId(Long userId) {
        List<Reservation> reservations = reservationRepository.findByParticipants_UserId(userId);
        return reservations.stream()
                .map(reservation -> {
                    Integer numSessions = !reservation.getSessions().isEmpty() ? (int) reservation.getSessions().size() : 0;
                    Integer numParticipants = !reservation.getParticipants().isEmpty() ? (int) reservation.getParticipants().size() : 0;
                    return new ReservationResponseDTO(
                            reservation.getId(),
                            reservation.getDate(),
                            reservation.getStatus(),
                            reservation.getTrack().getName(),
                            reservation.getTrack().getBannerImage(),
                            numSessions,
                            numParticipants,
                            reservation.getCreatedByUserId()
                    );
                })
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ReservationDetailsResponseDTO getReservationById(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));

        List<SimpleSessionResponseDTO> sessionResponses = reservation.getSessions().stream()
                .map(session -> new SimpleSessionResponseDTO(session.getId(), session.getBookedStartTime(), session.getBookedEndTime(), session.getActualStartTime(), session.getActualEndTime()))
                .collect(Collectors.toList());
        List<ParticipantResponseDTO> participantResponses = reservation.getParticipants().stream()
                .map(participant -> new ParticipantResponseDTO(
                        participant.getId(),
                        participant.getUser().getId(),
                        participant.getUser().getName(),
                        participant.getKart() != null ? participant.getKart().getId() : null,
                        participant.getKart() != null ? participant.getKart().getKartNumber() : null
                ))
                .collect(Collectors.toList());
        long totalSessionDurationMinutes = reservation.getSessions().stream()
            .mapToLong(session -> java.time.Duration.between(session.getBookedStartTime(), session.getBookedEndTime()).toMinutes())
            .sum();

        double price = calculateSessionCost(reservation, totalSessionDurationMinutes);
        long creatorId = reservation.getCreatedByUserId() != null ? reservation.getCreatedByUserId() : userId;
        return new ReservationDetailsResponseDTO(
                reservation.getId(),
                reservation.getDate(),
                reservation.getStatus(),
                reservation.getTrack().getId(),
                reservation.getTrack().getName(),
                sessionResponses,
                participantResponses,
                price,
                creatorId
                );
        }

    @Transactional
    public void cancelReservation(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));
        
        if (!reservation.getCreatedByUserId().equals(userId)) {
                throw new IllegalArgumentException("Only the user who created the reservation can cancel it.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING && reservation.getStatus() != ReservationStatus.ACCEPTED) {
                throw new IllegalArgumentException("Reservation cannot be cancelled as it is already concluded or cancelled.");
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        for (Participant participant : reservation.getParticipants()) {
                String participantNotificationTitle = "Reservation #" + reservation.getId() + " cancelled";
                String participantNotificationBody = String.format("The reservation on track '%s' to %s has been cancelled.",
                        reservation.getTrack().getName(),
                        reservation.getDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));
                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
        }
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getAcceptedAndPendingReservationsByTrackId(Long trackId, Long ownerId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        if (!track.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("Only the owner can view reservations for this track.");
        }

        List<ReservationStatus> targetStatuses = Arrays.asList(ReservationStatus.ACCEPTED, ReservationStatus.PENDING);

        List<Reservation> reservations = reservationRepository.findByTrackIdAndTrackOwnerIdAndStatuses(
                trackId, ownerId, targetStatuses);
        return reservations.stream()
                .map(reservation -> {
                    Integer numSessions = !reservation.getSessions().isEmpty() ? (int) reservation.getSessions().size() : 0;
                    Integer numParticipants = !reservation.getParticipants().isEmpty() ? (int) reservation.getParticipants().size() : 0;
                    return new ReservationResponseDTO(
                            reservation.getId(),
                            reservation.getDate(),
                            reservation.getStatus(),
                            reservation.getTrack().getName(),
                            reservation.getTrack().getBannerImage(),
                            numSessions,
                            numParticipants,
                            reservation.getCreatedByUserId()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getConcludedReservationsByTrackId(Long trackId, Long ownerId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));
        
        if (!track.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("Only the owner can view reservations for this track.");
        }

        List<ReservationStatus> targetStatuses = List.of(ReservationStatus.CONCLUDED);

        List<Reservation> reservations = reservationRepository.findByTrackIdAndTrackOwnerIdAndStatuses(
                trackId, ownerId, targetStatuses);
        return reservations.stream()
                .map(reservation -> {
                    Integer numSessions = !reservation.getSessions().isEmpty() ? (int) reservation.getSessions().size() : 0;
                    Integer numParticipants = !reservation.getParticipants().isEmpty() ? (int) reservation.getParticipants().size() : 0;
                    return new ReservationResponseDTO(
                            reservation.getId(),
                            reservation.getDate(),
                            reservation.getStatus(),
                            reservation.getTrack().getName(),
                            reservation.getTrack().getBannerImage(),
                            numSessions,
                            numParticipants,
                            reservation.getCreatedByUserId()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotResponseDTO> getSlotsForTrackAndDate(Long trackId, LocalDate date) {
            Track track = trackRepository.findById(trackId)
                    .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

            if (!track.getIsAvailable()) {
                    throw new IllegalArgumentException("Track is not available.");
            }

            DayOfWeek dayOfWeek = date.getDayOfWeek();
            Optional<DaySchedule> optionalSchedule = dayScheduleRepository.findByTrackAndDay(track, dayOfWeek);
            if (optionalSchedule.isEmpty()) {
                return Collections.emptyList();
            }
            DaySchedule trackSchedule = optionalSchedule.get();

            LocalTime openingTime = trackSchedule.getOpeningTime();
            LocalTime closingTime = trackSchedule.getClosingTime();
            LocalDateTime realClosingTime = date.atTime(trackSchedule.getClosingTime());
            int slotDurationMinutes = track.getSlotDuration();

            List<SlotResponseDTO> allPossibleSlots = new ArrayList<>();
            LocalTime currentSlotTime = openingTime;
            LocalDateTime realCurrentSlotTime = date.atTime(currentSlotTime);

            // Gerar todos os slots possíveis para o dia
            while (realCurrentSlotTime.isBefore(realClosingTime)) {
                LocalTime slotEndTime = currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes));
                if (realCurrentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes)).isAfter(realClosingTime) &&
                        !realCurrentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes)).equals(realClosingTime)) {
                    break;
                }

                allPossibleSlots.add(new SlotResponseDTO(currentSlotTime, slotEndTime, true));
                currentSlotTime = currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes));
                realCurrentSlotTime = realCurrentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes));
            }


            List<Session> existingOccupiedSessions = sessionRepository.findOccupiedSessionsForTrackAndDate(
                    track.getId(),
                    date,
                    ReservationStatus.PENDING,
                    ReservationStatus.ACCEPTED
            );

            for (SlotResponseDTO slot : allPossibleSlots) {
                boolean isOccupied = false;
                for (Session existingSession : existingOccupiedSessions) {
                    if (slot.getStartTime().isBefore(existingSession.getBookedEndTime()) &&
                            slot.getEndTime().isAfter(existingSession.getBookedStartTime())) {
                        isOccupied = true;
                        break;
                    }
                }
                slot.setAvailable(!isOccupied);
            }

            return allPossibleSlots;
    }

    @Transactional
    public void acceptReservation(Long reservationId, Long ownerId, NotificationMessageDTO request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));

        if (!reservation.getTrack().getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("Only the track owner can accept this reservation.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Reservation cannot be accepted as it is already " + reservation.getStatus() + ".");
        }

        reservation.setStatus(ReservationStatus.ACCEPTED);
        reservationRepository.save(reservation);

        // Enviar notificação para o user que fez a reserva
        User bookingUser = userRepository.findById(reservation.getCreatedByUserId())
                .orElseThrow(() -> new IllegalArgumentException("Booking user not found with ID: " + reservation.getCreatedByUserId()));
        
        String notificationTitle = "Reservation #" + reservation.getId() + " accepted";
        String notificationMessage = String.format("Your reservation on track '%s' to %s has been accepted.",
                reservation.getTrack().getName(),
                reservation.getDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

        if (request.getMessage() != null && !request.getMessage().isEmpty()) {
             notificationMessage = request.getMessage();
        }

        String notificationBody = notificationMessage;
        
        NotificationCreateRequestDTO bookingNotificationRequest = new NotificationCreateRequestDTO();
        bookingNotificationRequest.setUserId(bookingUser.getId());
        bookingNotificationRequest.setTitle(notificationTitle);
        bookingNotificationRequest.setBody(notificationBody);
        notificationService.createNotification(bookingNotificationRequest);
    }

    @Transactional
    public void rejectReservation(Long reservationId, Long ownerId, NotificationMessageDTO request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));

        if (!reservation.getTrack().getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("Only the track owner can reject this reservation.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Reservation cannot be rejected as it is already " + reservation.getStatus() + ".");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        reservationRepository.save(reservation);

        // Enviar notificação para o user que fez a reserva
        User bookingUser = userRepository.findById(reservation.getCreatedByUserId())
                .orElseThrow(() -> new IllegalArgumentException("Booking user not found with ID: " + reservation.getCreatedByUserId()));
        
        String notificationTitle = "Reservation #" + reservation.getId() + " rejected";
        String notificationMessage = String.format("Your reservation on track '%s' to %s has been rejected.",
                reservation.getTrack().getName(),
                reservation.getDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

        if (request.getMessage() != null && !request.getMessage().isEmpty()) {
             notificationMessage = request.getMessage();
        }

        String notificationBody = notificationMessage;
        
        NotificationCreateRequestDTO bookingNotificationRequest = new NotificationCreateRequestDTO();
        bookingNotificationRequest.setUserId(bookingUser.getId());
        bookingNotificationRequest.setTitle(notificationTitle);
        bookingNotificationRequest.setBody(notificationBody);
        notificationService.createNotification(bookingNotificationRequest);
    }

    @Transactional
    public ReservationDetailsResponseDTO updateReservation(Long reservationId, ReservationUpdateRequestDTO request, Long currentUserId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));

        // Authorization check: Only the user who created the reservation or the track owner can update it.
        if (!reservation.getCreatedByUserId().equals(currentUserId) && !reservation.getTrack().getOwner().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("You are not authorized to update this reservation.");
        }

        // Only PENDING reservations can be updated
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING reservations can be updated.");
        }

        // Update reservation date if provided
        LocalDate updatedReservationDate = request.getReservationDate() != null ? request.getReservationDate() : reservation.getDate();
        reservation.setDate(updatedReservationDate);

        // Retrieve track and schedule for validation
        Track track = reservation.getTrack();
        DayOfWeek reservationDayOfWeek = updatedReservationDate.getDayOfWeek();
        DaySchedule trackSchedule = dayScheduleRepository.findByTrackAndDay(track, reservationDayOfWeek)
                .orElseThrow(() -> new IllegalArgumentException("Track is not open on " + reservationDayOfWeek.name() + " for the updated date."));

        // Handle Sessions Update
        if (request.getSessions() != null && !request.getSessions().isEmpty()) {
            // Remove existing sessions first (simpler for full replacement)
            sessionRepository.deleteAll(reservation.getSessions());
            reservation.getSessions().clear();

            Set<Session> updatedSessions = new HashSet<>();
            for (SessionCreateDTO sessionDTO : request.getSessions()) {
                LocalDateTime sessionStartTime = LocalDateTime.of(updatedReservationDate, sessionDTO.getStartTime());
                LocalDateTime sessionEndTime = LocalDateTime.of(updatedReservationDate, sessionDTO.getEndTime());

                // Session time validations (reusing logic from createReservation)
                if (sessionStartTime.toLocalTime().isBefore(trackSchedule.getOpeningTime()) ||
                        sessionEndTime.toLocalTime().isAfter(trackSchedule.getClosingTime())) {
                    throw new IllegalArgumentException("Session times are outside track's operating hours for " + reservationDayOfWeek.name() + ".");
                }
                if (sessionStartTime.isAfter(sessionEndTime) || sessionStartTime.isEqual(sessionEndTime)) {
                    throw new IllegalArgumentException("Session start time must be before end time.");
                }

                // Check for overlaps with other existing reservations (excluding the current one's original sessions)
                List<Session> existingOccupiedSessions = sessionRepository.findOccupiedSessionsForTrackAndDateExcludingReservation(
                        track.getId(),
                        updatedReservationDate,
                        Arrays.asList(ReservationStatus.PENDING, ReservationStatus.ACCEPTED),
                        reservation.getId() // Exclude sessions from the current reservation
                );

                for (Session existingSession : existingOccupiedSessions) {
                    if (sessionStartTime.toLocalTime().isBefore(existingSession.getBookedEndTime()) &&
                            sessionEndTime.toLocalTime().isAfter(existingSession.getBookedStartTime())) {
                        throw new IllegalArgumentException("Session times overlap with an existing reservation.");
                    }
                }

                Session newSession = new Session(sessionStartTime.toLocalTime(), sessionEndTime.toLocalTime(), reservation, null, null);
                updatedSessions.add(newSession);
            }
            reservation.setSessions(updatedSessions);
            sessionRepository.saveAll(updatedSessions);
        }

        // Handle Participants Update
        if (request.getParticipants() != null) {
            Set<Participant> existingParticipants = reservation.getParticipants();
            Set<Participant> participantsToKeep = new HashSet<>();
            Set<Participant> participantsToAdd = new HashSet<>();
            Set<Long> updatedParticipantIds = new HashSet<>();

            boolean currentUserIdIsParticipant = false;

            for (ParticipantUpdateDTO participantDTO : request.getParticipants()) {
                User user = userRepository.findById(participantDTO.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found for participant with ID: " + participantDTO.getUserId()));

                if (user.getId().equals(currentUserId)) {
                    currentUserIdIsParticipant = true;
                }

                Kart kart = null;
                if (participantDTO.getKartId() != null) {
                    kart = kartRepository.findById(participantDTO.getKartId())
                            .orElseThrow(() -> new IllegalArgumentException("Kart not found with ID: " + participantDTO.getKartId()));

                    if (!kart.getTrack().equals(track)) {
                        throw new IllegalArgumentException("Kart with ID " + kart.getId() + " does not belong to this track.");
                    }
                    if (!kart.getIsAvailable()) {
                        throw new IllegalArgumentException("Kart with ID " + kart.getId() + " is not available.");
                    }
                }

                if (participantDTO.getParticipantId() != null) {
                    // Updating an existing participant
                    Participant participantToUpdate = existingParticipants.stream()
                            .filter(p -> p.getId().equals(participantDTO.getParticipantId()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Participant with ID " + participantDTO.getParticipantId() + " not found in this reservation."));

                    participantToUpdate.setUser(user);
                    participantToUpdate.setKart(kart);
                    participantsToKeep.add(participantToUpdate);
                    updatedParticipantIds.add(participantDTO.getParticipantId());
                } else {
                    // Adding a new participant
                    Participant newParticipant = new Participant(user, kart, reservation);
                    participantsToAdd.add(newParticipant);
                }
            }

            // Remove participants that were not included in the update request
            existingParticipants.removeIf(p -> !updatedParticipantIds.contains(p.getId()));

            reservation.getParticipants().clear();
            reservation.getParticipants().addAll(participantsToKeep);
            reservation.getParticipants().addAll(participantsToAdd);

            if (!track.getOwner().getId().equals(currentUserId) && !currentUserIdIsParticipant) {
                throw new IllegalArgumentException("Current user is not a participant in this reservation and not the track owner.");
            }

            participantRepository.saveAll(reservation.getParticipants()); // Save updated and new participants
            participantRepository.deleteAll(existingParticipants.stream().filter(p -> !updatedParticipantIds.contains(p.getId())).collect(Collectors.toSet())); // Delete removed participants
        }

        // Save the updated reservation
        Reservation savedReservation = reservationRepository.save(reservation);

        // Send notification about the update
        User bookingUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Booking user not found with ID: " + currentUserId));

        String notificationTitle = "Reservation #" + savedReservation.getId() + " updated";
        String notificationBody = String.format("Your reservation on track '%s' to %s has been updated.",
                track.getName(),
                savedReservation.getDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

        NotificationCreateRequestDTO bookingNotificationRequest = new NotificationCreateRequestDTO();
        bookingNotificationRequest.setUserId(bookingUser.getId());
        bookingNotificationRequest.setTitle(notificationTitle);
        bookingNotificationRequest.setBody(notificationBody);
        notificationService.createNotification(bookingNotificationRequest);

        // Notify other participants if their participation changed or if they are new
        for (Participant participant : savedReservation.getParticipants()) {
            if (!participant.getUser().equals(bookingUser)) {
                String participantNotificationTitle = "Reservation #" + savedReservation.getId() + " updated";
                String participantNotificationBody = String.format("A reservation you are part of (%s) on track '%s' to %s has been updated.",
                        savedReservation.getId(),
                        track.getName(),
                        savedReservation.getDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
            }
        }

        // Map to ReservationDetailsResponseDTO
        List<SimpleSessionResponseDTO> sessionResponses = savedReservation.getSessions().stream()
                .map(session -> new SimpleSessionResponseDTO(session.getId(), session.getBookedStartTime(), session.getBookedEndTime(), null, null))
                .collect(Collectors.toList());

        List<ParticipantResponseDTO> participantResponses = savedReservation.getParticipants().stream()
                .map(participant -> new ParticipantResponseDTO(
                        participant.getId(),
                        participant.getUser().getId(),
                        participant.getUser().getName(),
                        participant.getKart() != null ? participant.getKart().getId() : null,
                        participant.getKart() != null ? participant.getKart().getKartNumber() : null
                ))
                .collect(Collectors.toList());

        long totalSessionDurationMinutes = savedReservation.getSessions().stream()
                .mapToLong(session -> java.time.Duration.between(session.getBookedStartTime(), session.getBookedEndTime()).toMinutes())
                .sum();
        double price = calculateSessionCost(savedReservation, totalSessionDurationMinutes);
        long creatorId = savedReservation.getCreatedByUserId() != null ? savedReservation.getCreatedByUserId() : currentUserId;
        return new ReservationDetailsResponseDTO(
                savedReservation.getId(),
                savedReservation.getDate(),
                savedReservation.getStatus(),
                savedReservation.getTrack().getId(),
                savedReservation.getTrack().getName(),
                sessionResponses,
                participantResponses,
                price,
                creatorId
        );
    }
    private Double calculateSessionCost(Reservation reservation, long totalSessionDurationMinutes) {
        if (reservation.getTrack() == null || reservation.getTrack().getSlotPrice() == null || reservation.getTrack().getSlotDuration() == null || reservation.getTrack().getSlotDuration() <= 0) {
            return 0.0;
        }

        BigDecimal slotPrice = reservation.getTrack().getSlotPrice();
        Integer slotDuration = reservation.getTrack().getSlotDuration();

        double numberOfSlotsUsed = Math.ceil((double) totalSessionDurationMinutes / slotDuration);

        return slotPrice.multiply(BigDecimal.valueOf(numberOfSlotsUsed)).doubleValue();
    }
}