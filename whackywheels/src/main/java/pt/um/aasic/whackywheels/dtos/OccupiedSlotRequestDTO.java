package pt.um.aasic.whackywheels.dtos;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OccupiedSlotRequestDTO {
    @NotNull(message = "Track ID cannot be null")
    @Positive(message = "Track ID must be a positive number")
    private Long trackId;

    @NotNull(message = "Date cannot be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) //ex: 2025-06-09
    private LocalDate date;

    public OccupiedSlotRequestDTO() {
    }

    public OccupiedSlotRequestDTO(Long trackId, LocalDate date) {
        this.trackId = trackId;
        this.date = date;
    }

    // Getters
    public Long getTrackId() {
        return trackId;
    }

    public LocalDate getDate() {
        return date;
    }

    // Setters
    public void setTrackId(Long trackId) {
        this.trackId = trackId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "AvailableSlotsRequestDTO{" +
                "trackId=" + trackId +
                ", date=" + date +
                '}';
    }
}
