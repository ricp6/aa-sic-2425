package pt.um.aasic.whackywheels.dtos;

import pt.um.aasic.whackywheels.entities.ReservationStatus;

import java.time.LocalDate;
import java.util.List;

public class ReservationDetailsResponseDTO {
    private Long id;
    private LocalDate reservationDate;
    private ReservationStatus status;
    private Long trackId;
    private String trackName;
    private List<SessionResponseDTO> sessions;
    private List<ParticipantResponseDTO> participants;

    public ReservationDetailsResponseDTO() {}

    public ReservationDetailsResponseDTO(Long id, LocalDate reservationDate, ReservationStatus status, Long trackId, String trackName, List<SessionResponseDTO> sessions, List<ParticipantResponseDTO> participants) {
        this.id = id;
        this.reservationDate = reservationDate;
        this.status = status;
        this.trackId = trackId;
        this.trackName = trackName;
        this.sessions = sessions;
        this.participants = participants;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }
    public Long getTrackId() { return trackId; }
    public void setTrackId(Long trackId) { this.trackId = trackId; }
    public String getTrackName() { return trackName; }
    public void setTrackName(String trackName) { this.trackName = trackName; }
    public List<SessionResponseDTO> getSessions() { return sessions; }
    public void setSessions(List<SessionResponseDTO> sessions) { this.sessions = sessions; }
    public List<ParticipantResponseDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantResponseDTO> participants) { this.participants = participants; }
}

