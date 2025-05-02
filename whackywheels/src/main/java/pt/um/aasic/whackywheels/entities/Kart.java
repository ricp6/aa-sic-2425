package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;


@Entity
public class Kart {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Track track;

    @Column(length = 50)
    private String model;

    private Character kartNumber;

    private boolean isAvailable;

    public Kart() {}

    public Kart(Track track, String model, Character kartNumber, boolean isAvailable) {
        this.track = track;
        this.model = model;
        this.kartNumber = kartNumber;
        this.isAvailable = isAvailable;
    }

}

