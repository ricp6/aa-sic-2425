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

    private boolean isAvailable;

    @Column(length = 50)
    private String model;

    protected Kart() {}

    public Kart(@NonNull Track track, @NonNull Integer kartNumber, boolean isAvailable, String model) {
        this.track = track;
        this.kartNumber = kartNumber;
        this.isAvailable = isAvailable;
        this.model = model;
    }

    @NonNull
    public Track getTrack() {
        return track;
    }

    @NonNull
    public Integer getKartNumber() {
        return kartNumber;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getModel() {
        return model;
    }
}

