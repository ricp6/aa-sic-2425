package pt.um.aasic.whackywheels.entities;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.Set;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private LocalTime startTime;
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @OneToMany(mappedBy = "session")
    private Set<TimePerLap> timePerLaps;

    @OneToMany(mappedBy = "session")
    private Set<Classification> classifications;

    protected Session() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public Set<TimePerLap> getTimePerLaps() {
        return timePerLaps;
    }

    public void setTimePerLaps(Set<TimePerLap> timePerLaps) {
        this.timePerLaps = timePerLaps;
    }

    public Set<Classification> getClassifications() {
        return classifications;
    }

    public void setClassifications(Set<Classification> classifications) {
        this.classifications = classifications;
    }
}
