package pt.um.aasic.whackywheels.dtos;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public class ReservationCreateRequestDTO {
    @NotNull(message = "Track ID is mandatory")
    private Long trackId;

    @NotNull(message = "Reservation date and time is mandatory")
    @Future(message = "Reservation date and time must be in the future")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate reservationDate;

    @Valid
    @Size(min = 1, message = "At least one session is required for a reservation")
    private List<SessionCreateDTO> sessions;

    @Valid
    @NotNull(message = "Participants list cannot be null")
    @Size(min = 1, message = "At least one participant is required for a reservation")
    private List<ParticipantCreateDTO> participants;

    public ReservationCreateRequestDTO() {}

    public Long getTrackId() { return trackId; }
    public void setTrackId(Long trackId) { this.trackId = trackId; }
    public LocalDate getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }
    public List<SessionCreateDTO> getSessions() { return sessions; }
    public void setSessions(List<SessionCreateDTO> sessions) { this.sessions = sessions; }
    public List<ParticipantCreateDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantCreateDTO> participants) { this.participants = participants; }
}
