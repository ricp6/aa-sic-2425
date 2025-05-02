package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
public class TrackSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    private Track track;

    @NonNull
    private DayOfWeek day;

    @NonNull
    private LocalTime openingTime;

    @NonNull
    private LocalTime closingTime;

    protected TrackSchedule() {}

    public TrackSchedule(@NonNull Track track, @NonNull DayOfWeek day, @NonNull LocalTime openingTime, @NonNull LocalTime closingTime) {
        this.track = track;
        this.day = day;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
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
