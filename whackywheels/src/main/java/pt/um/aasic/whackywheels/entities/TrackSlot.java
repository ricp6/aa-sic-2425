package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalTime;
import java.util.Date;

@Entity
public class TrackSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    private Track track;

    @NonNull
    private Date date;

    @NonNull
    private LocalTime startTime;

    private boolean available;

    protected TrackSlot() {}

    public TrackSlot(@NonNull Track track, @NonNull Date date, @NonNull LocalTime startTime, boolean available) {
        this.track = track;
        this.date = date;
        this.startTime = startTime;
        this.available = available;
    }

    @NonNull
    public Date getDate() {
        return date;
    }

    public void setDate(@NonNull Date date) {
        this.date = date;
    }

    @NonNull
    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@NonNull LocalTime startTime) {
        this.startTime = startTime;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
