package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;

import java.util.Set;


@Entity
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @OneToMany(mappedBy = "participant")
    private Set<TimePerLap> timePerLaps;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "kart_id")
    private Kart kart;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    public Participant() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<TimePerLap> getTimePerLaps() {
        return timePerLaps;
    }

    public void setTimePerLaps(Set<TimePerLap> timePerLaps) {
        this.timePerLaps = timePerLaps;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Kart getKart() {
        return kart;
    }

    public void setKart(Kart kart) {
        this.kart = kart;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
}
