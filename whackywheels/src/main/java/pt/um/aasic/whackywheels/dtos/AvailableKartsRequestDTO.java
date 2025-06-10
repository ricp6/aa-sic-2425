package pt.um.aasic.whackywheels.dtos;

import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class AvailableKartsRequestDTO {

    @NotNull(message = "Track ID cannot be null")
    @Positive(message = "Track ID must be a positive number")
    private Long trackId;

    @NotNull(message = "Session start time cannot be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) // Formato: YYYY-MM-DDTHH:MM:SS
    private LocalDateTime sessionStart;

    @NotNull(message = "Session end time cannot be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) // Formato: YYYY-MM-DDTHH:MM:SS
    private LocalDateTime sessionEnd;

    public AvailableKartsRequestDTO() {
    }

    public AvailableKartsRequestDTO(Long trackId, LocalDateTime sessionStart, LocalDateTime sessionEnd) {
        this.trackId = trackId;
        this.sessionStart = sessionStart;
        this.sessionEnd = sessionEnd;
    }

    public Long getTrackId() {
        return trackId;
    }

    public LocalDateTime getSessionStart() {
        return sessionStart;
    }

    public LocalDateTime getSessionEnd() {
        return sessionEnd;
    }

    public void setTrackId(Long trackId) {
        this.trackId = trackId;
    }

    public void setSessionStart(LocalDateTime sessionStart) {
        this.sessionStart = sessionStart;
    }

    public void setSessionEnd(LocalDateTime sessionEnd) {
        this.sessionEnd = sessionEnd;
    }

    @Override
    public String toString() {
        return "AvailableKartsRequestDTO{" +
                "trackId=" + trackId +
                ", sessionStart=" + sessionStart +
                ", sessionEnd=" + sessionEnd +
                '}';
    }
}