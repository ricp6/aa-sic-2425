package pt.um.aasic.whackywheels.services;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import pt.um.aasic.whackywheels.dtos.*;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.*;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    public ReservationResponseDTO createReservation(ReservationCreateRequestDTO request, Long currentUserId) {

        Track track = trackRepository.findById(request.getTrackId())
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + request.getTrackId()));

        if (!track.getIsAvailable()) {
            throw new IllegalArgumentException("Track is not available.");
        }


        DayOfWeek reservationDayOfWeek = request.getReservationDateTime().getDayOfWeek();
        DaySchedule trackSchedule = dayScheduleRepository.findByTrackAndDay(track, reservationDayOfWeek)
                .orElseThrow(() -> new IllegalArgumentException("Track is not open on " + reservationDayOfWeek.name() + "."));


        Reservation reservation = new Reservation();
        reservation.setDate(request.getReservationDateTime());
        reservation.setTrack(track);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setCreatedByUserId(currentUserId);

        LocalDate reservationDate = request.getReservationDateTime().toLocalDate();

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
                    reservationDate.atStartOfDay(),
                    reservationDate.atTime(23, 59, 59),
                    ReservationStatus.PENDING,
                    ReservationStatus.ACCEPTED
            );
            for (Session existingSession : existingOccupiedSessions) {
                if (sessionStartTime.toLocalTime().isBefore(existingSession.getEndTime()) &&
                        sessionEndTime.toLocalTime().isAfter(existingSession.getStartTime())) {
                throw new IllegalArgumentException("Session times overlap with an existing reservation.");
                }
            }

            Session session = new Session(sessionStartTime.toLocalTime(), sessionEndTime.toLocalTime(), reservation);
            sessions.add(session);
        }
        reservation.setSessions(sessions);

        Set<Participant> participants = new HashSet<>();
        for (ParticipantCreateDTO participantDTO : request.getParticipants()) {
            User user = userRepository.findById(participantDTO.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found for participant with ID: " + participantDTO.getUserId()));

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
                request.getReservationDateTime().toLocalDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE),
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
                        request.getReservationDateTime().toLocalDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));

                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
            }
        }

        // 8. Mapear para ReservationResponseDTO
        List<SessionResponseDTO> sessionResponses = savedReservation.getSessions().stream()
                .map(session -> new SessionResponseDTO(session.getId(), session.getStartTime(), session.getEndTime()))
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

        return new ReservationResponseDTO(
                savedReservation.getId(),
                savedReservation.getDate(),
                savedReservation.getStatus(),
                savedReservation.getTrack().getId(),
                savedReservation.getTrack().getName(),
                sessionResponses,
                participantResponses
        );
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getReservationsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Reservation> reservations = reservationRepository.findByParticipants_User(user);

        return reservations.stream()
                .map(reservation -> {
                    List<SessionResponseDTO> sessionResponses = reservation.getSessions().stream()
                            .map(session -> new SessionResponseDTO(session.getId(), session.getStartTime(), session.getEndTime()))
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

                    return new ReservationResponseDTO(
                            reservation.getId(),
                            reservation.getDate(),
                            reservation.getStatus(),
                            reservation.getTrack().getId(),
                            reservation.getTrack().getName(),
                            sessionResponses,
                            participantResponses
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponseDTO getReservationById(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));
        
        // Verifica se o utilizador atual é um participante da reserva
        boolean isParticipant = reservation.getParticipants().stream()
                .anyMatch(participant -> participant.getUser().getId().equals(userId));
        if (!isParticipant) {
            throw new IllegalArgumentException("User does not have access to this reservation.");
        }
        List<SessionResponseDTO> sessionResponses = reservation.getSessions().stream()
                .map(session -> new SessionResponseDTO(session.getId(), session.getStartTime(), session.getEndTime()))
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
        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getDate(),
                reservation.getStatus(),
                reservation.getTrack().getId(),
                reservation.getTrack().getName(),
                sessionResponses,
                participantResponses
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
                        reservation.getDate().toLocalDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));
                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
        }
    }

    @Transactional
    public ReservationResponseDTO updateReservation(Long reservationId, ReservationCreateRequestDTO request, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + reservationId));

        if (!reservation.getCreatedByUserId().equals(userId)) {
                throw new IllegalArgumentException("Only the user who created the reservation can update it.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
                throw new IllegalArgumentException("Reservation cannot be updated as it is already "+ reservation.getStatus() +".");
        }

        Track track = trackRepository.findById(request.getTrackId()).orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + request.getTrackId()));

        if (!track.getIsAvailable()) {
                throw new IllegalArgumentException("Track is not available.");
        }

        DayOfWeek reservationDayOfWeek = request.getReservationDateTime().getDayOfWeek();
        DaySchedule trackSchedule = dayScheduleRepository.findByTrackAndDay(track, reservationDayOfWeek)
                .orElseThrow(() -> new IllegalArgumentException("Track is not open on " + reservationDayOfWeek.name() + "."));

        reservation.setTrack(track);
        reservation.setDate(request.getReservationDateTime());

        Set<Session> sessions = new HashSet<>();
        for (SessionCreateDTO sessionDTO : request.getSessions()) {
                LocalDateTime sessionStartTime = LocalDateTime.of(request.getReservationDateTime().toLocalDate(), sessionDTO.getStartTime());
                LocalDateTime sessionEndTime = LocalDateTime.of(request.getReservationDateTime().toLocalDate(), sessionDTO.getEndTime());

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

                // c) Garantir que o slot não está ocupado
                List<Session> existingOccupiedSessions = sessionRepository.findOccupiedSessionsForTrackAndDate(
                        track.getId(),
                        request.getReservationDateTime().toLocalDate().atStartOfDay(),
                        request.getReservationDateTime().toLocalDate().atTime(23, 59, 59),
                        ReservationStatus.PENDING,
                        ReservationStatus.ACCEPTED
                );
                for (Session existingSession : existingOccupiedSessions) {
                        if (sessionStartTime.toLocalTime().isBefore(existingSession.getEndTime()) &&
                                sessionEndTime.toLocalTime().isAfter(existingSession.getStartTime())) {
                                throw new IllegalArgumentException("Session times overlap with an existing reservation.");
                        }
                }

                Session session = new Session(sessionStartTime.toLocalTime(), sessionEndTime.toLocalTime(), reservation);
                sessions.add(session);
        }

        reservation.setSessions(sessions);

        Set<Participant> participants = new HashSet<>();
        for (ParticipantCreateDTO participantDTO : request.getParticipants()) {
                User user = userRepository.findById(participantDTO.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found for participant with ID: " + participantDTO.getUserId()));
                Kart kart = null;
                if (participantDTO.getKartId() != null) {
                        kart = kartRepository.findById(participantDTO.getKartId())
                                .orElseThrow(() -> new IllegalArgumentException("Kart not found with ID: " + participantDTO.getKartId()));
                        if (!kart.getTrack().equals(track)) {
                                throw new IllegalArgumentException("Kart with ID " + kart.getId() + " does not belong to this track.");
                        }
                        // Verifica se o kart está disponível
                        if (!kart.getIsAvailable()) {
                                throw new IllegalArgumentException("Kart with ID " + kart.getId() + " is not available.");
                        }
                }
                Participant participant = new Participant(user, kart, reservation);
                participants.add(participant);
        }

        reservation.setParticipants(participants);
        Reservation savedReservation = reservationRepository.save(reservation);
        sessionRepository.saveAll(sessions);
        participantRepository.saveAll(participants);

        // Enviar notificação para o user que fez a reserva
        User bookingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Booking user not found with ID: " + userId));
        String notificationTitle = "Reservation #" + savedReservation.getId() + " updated";
        String notificationBody = String.format("Your reservation on track '%s' to %s has been updated.",
                track.getName(),
                request.getReservationDateTime().toLocalDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));
        NotificationCreateRequestDTO bookingNotificationRequest = new NotificationCreateRequestDTO();
        bookingNotificationRequest.setUserId(bookingUser.getId());
        bookingNotificationRequest.setTitle(notificationTitle);
        bookingNotificationRequest.setBody(notificationBody);
        notificationService.createNotification(bookingNotificationRequest);
        for (Participant participant : participants) {
                if (!participant.getUser().equals(bookingUser)) {
                String participantNotificationTitle = "Reservation #" + savedReservation.getId() + " updated";
                String participantNotificationBody = String.format("Your participation in the reservation on track '%s' to %s has been updated.",
                        track.getName(),
                        request.getReservationDateTime().toLocalDate().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE));
                NotificationCreateRequestDTO participantNotificationRequest = new NotificationCreateRequestDTO();
                participantNotificationRequest.setUserId(participant.getUser().getId());
                participantNotificationRequest.setTitle(participantNotificationTitle);
                participantNotificationRequest.setBody(participantNotificationBody);
                notificationService.createNotification(participantNotificationRequest);
                }
        }

        // Mapear para ReservationResponseDTO
        List<SessionResponseDTO> sessionResponses = savedReservation.getSessions().stream()
                .map(session -> new SessionResponseDTO(session.getId(), session.getStartTime(), session.getEndTime()))
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
        return new ReservationResponseDTO(
                savedReservation.getId(),
                savedReservation.getDate(),
                savedReservation.getStatus(),
                savedReservation.getTrack().getId(),
                savedReservation.getTrack().getName(),
                sessionResponses,
                participantResponses
        );
        }

    @Transactional(readOnly = true)
    public List<SlotResponseDTO> getSlotsForTrackAndDate(Long trackId, LocalDate date) {
            Track track = trackRepository.findById(trackId)
                    .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

            if (!track.getIsAvailable()) {
                    throw new IllegalArgumentException("Track is not available.");
            }

            DayOfWeek dayOfWeek = date.getDayOfWeek();
            DaySchedule trackSchedule = dayScheduleRepository.findByTrackAndDay(track, dayOfWeek)
                    .orElseThrow(() -> new IllegalArgumentException("Track is not open on " + dayOfWeek.name() + "."));

            LocalTime openingTime = trackSchedule.getOpeningTime();
            LocalTime closingTime = trackSchedule.getClosingTime();
            int slotDurationMinutes = track.getSlotDuration();

            List<SlotResponseDTO> allPossibleSlots = new ArrayList<>();
            LocalTime currentSlotTime = openingTime;

            // Gerar todos os slots possíveis para o dia
            while (currentSlotTime.isBefore(closingTime)) {
                LocalTime slotEndTime = currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes));
                if (currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes)).isAfter(closingTime) &&
                        !currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes)).equals(closingTime)) {
                    break;
                }

                allPossibleSlots.add(new SlotResponseDTO(currentSlotTime, slotEndTime, true));
                currentSlotTime = currentSlotTime.plus(Duration.ofMinutes(slotDurationMinutes));
            }

            List<Session> existingOccupiedSessions = sessionRepository.findOccupiedSessionsForTrackAndDate(
                    track.getId(),
                    date.atStartOfDay(),
                    date.atTime(23, 59, 59),
                    ReservationStatus.PENDING,
                    ReservationStatus.ACCEPTED
            );

            List<SlotResponseDTO> occupiedSlots = new ArrayList<>();

            for (SlotResponseDTO slot : allPossibleSlots) {
                boolean isOccupied = false;
                for (Session existingSession : existingOccupiedSessions) {
                    if (slot.getStartTime().isBefore(existingSession.getEndTime()) &&
                            slot.getEndTime().isAfter(existingSession.getStartTime())) {
                        isOccupied = true;
                        break;
                    }
                }
                slot.setAvailable(!isOccupied);
            }

            return allPossibleSlots;
    }
}