package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;


@Entity
public class ReservationParticipant {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Reservation reservation;

    @ManyToOne
    private User user;

    @ManyToOne
    private Kart kart;

    public ReservationParticipant() {}

    public ReservationParticipant(Reservation reservation, User user, Kart kart) {
        this.reservation = reservation;
        this.user = user;
        this.kart = kart;
    }
}
