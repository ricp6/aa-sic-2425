package pt.um.aasic.whackywheels.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pt.um.aasic.whackywheels.dtos.*;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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
    public ReservationResponseDTO  createReservation(ReservationCreateRequestDTO request, Long currentUserId) {

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
            // c) TODO: se quisermos adicionar lógica para garantir que o slot não está ocupado ( apesar de já estar filtrado no frontend)


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
                // TODO: Adicionar ou não verificação para ver se o kart está disponível, isto se já estiver filtrado no frontend n é preciso

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
}