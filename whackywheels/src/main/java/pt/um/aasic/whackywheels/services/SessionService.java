package pt.um.aasic.whackywheels.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import pt.um.aasic.whackywheels.dtos.DriverClassificationDTO;
import pt.um.aasic.whackywheels.dtos.SessionsDetailsResponseDTO;
import pt.um.aasic.whackywheels.dtos.SessionsResponseDTO;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.SessionRepository;
import pt.um.aasic.whackywheels.repositories.ReservationRepository;
import pt.um.aasic.whackywheels.repositories.TimePerLapRepository;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final ReservationRepository reservationRepository;
    private final TimePerLapRepository timePerLapRepository;

    public SessionService(SessionRepository sessionRepository, ReservationRepository reservationRepository, TimePerLapRepository timePerLapRepository) {
        this.sessionRepository = sessionRepository;
        this.reservationRepository = reservationRepository;
        this.timePerLapRepository = timePerLapRepository;
    }

    @Transactional(readOnly = true)
    public List<SessionsResponseDTO> getSessionsByUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null.");
        }

        List<Session> sessions = sessionRepository.findSessionsByUserId(userId, ReservationStatus.CONCLUDED);

        return sessions.stream().map(session -> {
            String trackName = (session.getReservation() != null && session.getReservation().getTrack() != null)
                               ? session.getReservation().getTrack().getName()
                               : "N/A";

            int numParticipants = (session.getReservation() != null && session.getReservation().getParticipants() != null)
                                   ? session.getReservation().getParticipants().size()
                                   : 0;

            Integer position = null;
            Double personalRecord = null;

            Optional<Double> userBestLap = session.getTimePerLaps().stream()
                .filter(tpl -> tpl.getParticipant() != null &&
                               tpl.getParticipant().getUser() != null &&
                               tpl.getParticipant().getUser().getId().equals(userId))
                .map(TimePerLap::getLapTime)
                .min(Double::compare);

            if (userBestLap.isPresent()) {
                personalRecord = userBestLap.get();
            }

            Optional<Classification> userClassification = session.getClassifications().stream()
                .filter(c -> c.getParticipant() != null && c.getParticipant().getUser() != null &&
                             c.getParticipant().getUser().getId().equals(userId))
                .findFirst();

            if (userClassification.isPresent() && userClassification.get().getPosition() != null) {
                position = userClassification.get().getPosition().intValue();
            }

            return new SessionsResponseDTO(
                session.getId(),
                trackName,
                session.getReservation().getDate(),
                numParticipants,
                position,
                personalRecord
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SessionsDetailsResponseDTO getSessionDetailsBySessionId(Long sessionId, Long userId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null.");
        }

        Session session = sessionRepository.findByIdWithAllDetails(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Get reservation details from the fetched session
        Reservation reservation = session.getReservation();
        if (reservation == null) {
            throw new IllegalArgumentException("Session has no associated reservation.");
        }
        
        if(!reservation.getCreatedByUserId().equals(userId) && !reservation.getParticipants().stream()
                .anyMatch(participant -> participant.getUser() != null && participant.getUser().getId().equals(userId))) {
            throw new IllegalArgumentException("You do not have access to this session's details.");
        }

        // Ensure the reservation is completed for showing details
        if (reservation.getStatus() != ReservationStatus.CONCLUDED) {
            throw new IllegalArgumentException("Session details can only be retrieved for completed reservations.");
        }

        String trackName = (reservation.getTrack() != null) ? reservation.getTrack().getName() : "N/A";
        LocalDate date = reservation.getDate();

        long kartsUsed = reservation.getParticipants().stream()
                                    .filter(p -> p.getKart() != null)
                                    .map(Participant::getKart)
                                    .distinct()
                                    .count();

        String sessionDurationFormatted = "N/A";
        long totalSessionDurationMinutes = 0;
        if (session.getActualStartTime() != null && session.getActualEndTime() != null) {
            Duration duration = Duration.between(session.getActualStartTime(), session.getActualEndTime());
            // Handle cases where end time might be on the next day if starting near midnight
            if (duration.isNegative()) {
                duration = duration.plusDays(1); // Assuming sessions don't span more than 24 hours
            }

            long minutes = duration.toMinutes();
            long seconds = duration.toSecondsPart();
            sessionDurationFormatted = String.format("%dm %ds", minutes, seconds);
        } else if (session.getBookedStartTime() != null && session.getBookedEndTime() != null) {
            // Fallback to booked duration if actual times are not available (e.g., if session not started/ended)
            Duration duration = Duration.between(session.getBookedStartTime(), session.getBookedEndTime());
            if (duration.isNegative()) {
                duration = duration.plusDays(1);
            }
            long minutes = duration.toMinutes();
            long seconds = duration.toSecondsPart();
            sessionDurationFormatted = String.format("%dm %ds (booked)", minutes, seconds);
        }

        List<DriverClassificationDTO> driverClassifications = session.getClassifications().stream()
            .map(classification -> {
                String driverName = "Unknown Driver";
                Integer totalLaps = 0;
                Double averageLapTime = classification.getAverageTime();
                Double bestLapTime = classification.getBestLapTime();
                Integer finalPosition = classification.getPosition() != null ? classification.getPosition().intValue() : null;

                if (classification.getParticipant() != null && classification.getParticipant().getUser() != null) {
                    driverName = classification.getParticipant().getUser().getName();

                    // Calculate total laps for this participant in this session from TimePerLap
                    totalLaps = (int) classification.getParticipant().getTimePerLaps().stream()
                        .filter(tpl -> tpl.getSession() != null && tpl.getSession().getId().equals(session.getId()))
                        .count();
                }

                return new DriverClassificationDTO(
                    driverName,
                    totalLaps,
                    averageLapTime,
                    bestLapTime,
                    finalPosition
                );
            })
            .sorted(Comparator.comparing(dto -> dto.getFinalPosition() != null ? dto.getFinalPosition() : Integer.MAX_VALUE))
            .collect(Collectors.toList());

        return new SessionsDetailsResponseDTO(
            session.getId(),
            trackName,
            date,
            (int) kartsUsed,
            sessionDurationFormatted,
            driverClassifications
        );
    }

    @Transactional
    public void startSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Check if session is already started or completed
        if (session.getActualStartTime() != null) {
            throw new IllegalStateException("Session " + sessionId + " has already been started or completed.");
        }
        if (session.getActualEndTime() != null) {
             throw new IllegalStateException("Session " + sessionId + " has already been completed.");
        }

        if (session.getReservation() == null || session.getReservation().getStatus() != ReservationStatus.ACCEPTED) {
            throw new IllegalStateException("Session " + sessionId + " cannot be started. Reservation is not accepted or does not exist.");
        }

        // AQUI SERIA A LOGICA DE MANDAR A INFO PARA O KART

        session.setActualStartTime(LocalTime.now());
        sessionRepository.save(session);
    }

    @Transactional
    public void recordLapTime(Long sessionId, Long participantId, Double lapTime) {
        Session session = sessionRepository.findByIdWithAllDetails(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        if (session.getActualStartTime() == null || session.getActualEndTime() != null) {
            throw new IllegalStateException("Session " + sessionId + " is not in progress.");
        }

        if (participantId == null) {
            throw new IllegalArgumentException("Participant ID cannot be null.");
        }

        if (lapTime == null || lapTime <= 0) {
            throw new IllegalArgumentException("Lap time must be a positive number.");
        }

        if (session.getReservation() == null || session.getReservation().getStatus() != ReservationStatus.ACCEPTED) {
            throw new IllegalStateException("Session " + sessionId + " cannot record lap time. Reservation is not accepted or does not exist.");
        }

        Participant participant = session.getReservation().getParticipants().stream()
                .filter(p -> p.getId().equals(participantId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Participant not found with ID: " + participantId + " in session " + sessionId));

        int currentLapNumber = (int) participant.getTimePerLaps().stream()
                .filter(tpl -> tpl.getSession() != null && tpl.getSession().getId().equals(sessionId))
                .count() + 1;

        TimePerLap newLap = new TimePerLap(currentLapNumber, lapTime, participant, session);

        timePerLapRepository.save(newLap);
    }

    @Transactional
    public void endSession(Long sessionId) {
        Session session = sessionRepository.findByIdForEndingSession(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        if (session.getActualStartTime() == null) {
            throw new IllegalStateException("Session " + sessionId + " has not been started yet.");
        }
        if (session.getActualEndTime() != null) {
            throw new IllegalStateException("Session " + sessionId + " has already been completed.");
        }

        if (session.getReservation() == null || session.getReservation().getStatus() != ReservationStatus.ACCEPTED) {
            throw new IllegalStateException("Session " + sessionId + " cannot be ended. Reservation is not accepted or does not exist.");
        }

        session.setActualEndTime(LocalTime.now());
        sessionRepository.save(session);
        

        Reservation reservation = session.getReservation();

        Set<Session> allReservationSessions = reservation.getSessions();
        if (allReservationSessions == null || allReservationSessions.isEmpty()) {
            throw new IllegalStateException("Reservation ID: "+reservation.getId()+" has no associated sessions. Cannot determine completion status.");
        } else {
            boolean allSessionsCompleted = true;
            for (Session resSession : allReservationSessions) {
                Optional<Session> currentSessionStatus = sessionRepository.findById(resSession.getId());
                if (currentSessionStatus.isEmpty() || currentSessionStatus.get().getActualEndTime() == null) {
                    allSessionsCompleted = false;
                    break;
                }
            }

            if (allSessionsCompleted && reservation.getStatus() != ReservationStatus.CONCLUDED) {
                reservation.setStatus(ReservationStatus.CONCLUDED);
                reservationRepository.save(reservation);
            }
        }
        
        session.getClassifications().clear();

        List<Classification> newClassifications = session.getReservation().getParticipants().stream()
                .map(participant -> {
                    List<TimePerLap> participantLaps = participant.getTimePerLaps().stream()
                            .filter(tpl -> tpl.getSession() != null && tpl.getSession().getId().equals(sessionId))
                            .collect(Collectors.toList());

                    Classification classification = new Classification();
                    classification.setSession(session);
                    classification.setParticipant(participant);

                    if (!participantLaps.isEmpty()) {
                        Double bestLapTime = participantLaps.stream()
                                .map(TimePerLap::getLapTime)
                                .min(Double::compare)
                                .orElse(0.0);

                        Double averageLapTime = participantLaps.stream()
                                .mapToDouble(TimePerLap::getLapTime)
                                .average()
                                .orElse(0.0);

                        classification.setBestLapTime(bestLapTime);
                        classification.setAverageTime(averageLapTime);
                    } else {
                        classification.setBestLapTime(0.0);
                        classification.setAverageTime(0.0);
                    }
                    classification.setPosition(null);
                    return classification;
                })
                .collect(Collectors.toList());

        newClassifications.sort(Comparator.comparing(
                Classification::getBestLapTime,
                Comparator.nullsLast(Double::compare)
        ));

        for (int i = 0; i < newClassifications.size(); i++) {
            newClassifications.get(i).setPosition((double) (i + 1));
        }

        session.getClassifications().addAll(newClassifications);
        sessionRepository.save(session);
    }

    @Scheduled(fixedRate = 60000) // Runs every 60 seconds (1 minute)
    @Transactional
    public void autoEndExpiredSessions() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Find sessions that are accepted/in progress and whose end time has passed
        // We'll need a new repository method for this.
        List<Session> expiredSessions = sessionRepository.findSessionsToEnd(today, now);

        if (expiredSessions.isEmpty()) {
            return;
        }


        for (Session session : expiredSessions) {
            try {
                endSession(session.getId());
            } catch (Exception e) {
                System.err.println("Failed to auto-end session " + session.getId());
            }
        }
    }
}