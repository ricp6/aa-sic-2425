package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;


@Entity
public class Kart {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    private Track track;

    @NonNull
    private Integer kartNumber;

    private Boolean isAvailable; // true - available, false - occupied, null - maintenance

    @Column(length = 50)
    private String model;

    protected Kart() {}

    public Kart(@NonNull Track track, @NonNull Integer kartNumber, Boolean isAvailable, String model) {
        this.track = track;
        this.kartNumber = kartNumber;
        this.isAvailable = isAvailable;
        this.model = model;
    }

    public Long getId() {
        return id;
    }

    @NonNull
    public Track getTrack() {
        return track;
    }

    @NonNull
    public Integer getKartNumber() {
        return kartNumber;
    }

    public void setKartNumber(@NonNull Integer kartNumber) {
        this.kartNumber = kartNumber;
    }

    public Boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(Boolean available) {
        isAvailable = available;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}

