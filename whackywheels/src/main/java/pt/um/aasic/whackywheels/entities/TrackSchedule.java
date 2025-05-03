package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Embeddable
public class TrackSchedule {

    @NonNull
    private DayOfWeek day;

    @NonNull
    private LocalTime openingTime;

    @NonNull
    private LocalTime closingTime;

    protected TrackSchedule() {}

    public TrackSchedule(@NonNull DayOfWeek day, @NonNull LocalTime openingTime, @NonNull LocalTime closingTime) {
        this.day = day;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
    }

    @NonNull
    public DayOfWeek getDay() {
        return day;
    }

    @NonNull
    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(@NonNull LocalTime openingTime) {
        this.openingTime = openingTime;
    }

    @NonNull
    public LocalTime getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(@NonNull LocalTime closingTime) {
        this.closingTime = closingTime;
    }
}
