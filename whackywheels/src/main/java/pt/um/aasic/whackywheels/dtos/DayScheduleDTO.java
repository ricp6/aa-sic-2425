package pt.um.aasic.whackywheels.dtos;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;

public class DayScheduleDTO {
    @NotNull(message = "Day of week cannot be null")
    private DayOfWeek day;

    @NotNull(message = "Opening time cannot be null")
    private LocalTime openingTime;

    @NotNull(message = "Closing time cannot be null")
    private LocalTime closingTime;

    public DayScheduleDTO() {}

    public DayScheduleDTO(DayOfWeek day, LocalTime openingTime, LocalTime closingTime) {
        this.day = day;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
    }

    public DayOfWeek getDay() { return day; }
    public void setDay(DayOfWeek day) { this.day = day; }
    public LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }
    public LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }
}
