package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalTime;
import java.time.LocalDate;

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
    private LocalDate date;

    @NonNull
    private LocalTime startTime;

    @ManyToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation;

    protected TrackSlot() {}

    public TrackSlot(@NonNull Track track, @NonNull LocalDate date, @NonNull LocalTime startTime) {
        this.track = track;
        this.date = date;
        this.startTime = startTime;
    }

    public Long getId() {
        return id;
    }

    @NonNull
    public Track getTrack() {
        return track;
    }

    @NonNull
    public LocalDate getDate() {
        return date;
    }

    public void setDate(@NonNull LocalDate date) {
        this.date = date;
    }

    @NonNull
    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@NonNull LocalTime startTime) {
        this.startTime = startTime;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public boolean isAvailable() {
        return reservation == null;
    }
}
