package pt.um.aasic.whackywheels.entities;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(nullable = false)
    private LocalTime bookedStartTime;
    @Column(nullable = false)
    private LocalTime bookedEndTime;
    private LocalTime actualStartTime;
    private LocalTime actualEndTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @OneToMany(mappedBy = "session")
    private Set<TimePerLap> timePerLaps;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Classification> classifications;

    public Session() {}

    public Session(LocalTime bookedStartTime, LocalTime bookedEndTime, Reservation reservation, LocalTime actualStartTime, LocalTime actualEndTime) {
        this.bookedStartTime = bookedStartTime;
        this.bookedEndTime = bookedEndTime;
        this.reservation = reservation;
        this.actualStartTime = actualStartTime;
        this.actualEndTime = actualEndTime;

        this.timePerLaps = new HashSet<>();
        this.classifications = new HashSet<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getBookedStartTime() {
        return bookedStartTime;
    }

    public void setBookedStartTime(LocalTime bookedStartTime) {
        this.bookedStartTime = bookedStartTime;
    }

    public LocalTime getBookedEndTime() {
        return bookedEndTime;
    }

    public void setBookedEndTime(LocalTime bookedEndTime) {
        this.bookedEndTime = bookedEndTime;
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

    public LocalTime getActualStartTime() {
        return actualStartTime;
    }

    public void setActualStartTime(LocalTime actualStartTime) {
        this.actualStartTime = actualStartTime;
    }

    public LocalTime getActualEndTime() {
        return actualEndTime;
    }

    public void setActualEndTime(LocalTime actualEndTime) {
        this.actualEndTime = actualEndTime;
    }
}
