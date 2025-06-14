package pt.um.aasic.whackywheels.dtos.session;

import java.time.LocalTime;

public class SimpleSessionResponseDTO {
    private Long id;
    private LocalTime bookedStartTime;
    private LocalTime bookedEndTime;
    private LocalTime realStartTime;
    private LocalTime realEndTime;

    public SimpleSessionResponseDTO() {}

    public SimpleSessionResponseDTO(Long id, LocalTime bookedStartTime, LocalTime bookedEndTime, LocalTime realStartTime, LocalTime realEndTime) {
        this.id = id;
        this.bookedStartTime = bookedStartTime;
        this.bookedEndTime = bookedEndTime;
        this.realStartTime = realStartTime;
        this.realEndTime = realEndTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalTime getBookedStartTime() { return bookedStartTime; }
    public void setBookedStartTime(LocalTime bookedStartTime) { this.bookedStartTime = bookedStartTime; }
    public LocalTime getBookedEndTime() { return bookedEndTime; }
    public void setBookedEndTime(LocalTime bookedEndTime) { this.bookedEndTime = bookedEndTime; }
    public LocalTime getRealStartTime() { return realStartTime; }
    public void setRealStartTime(LocalTime realStartTime) { this.realStartTime = realStartTime; }
    public LocalTime getRealEndTime() { return realEndTime; }
    public void setRealEndTime(LocalTime realEndTime) { this.realEndTime = realEndTime; }
}
