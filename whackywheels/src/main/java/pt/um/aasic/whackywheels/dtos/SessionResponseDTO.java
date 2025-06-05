package pt.um.aasic.whackywheels.dtos;

import java.time.LocalTime;

public class SessionResponseDTO {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;

    public SessionResponseDTO() {}

    public SessionResponseDTO(Long id, LocalTime startTime, LocalTime endTime) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}
