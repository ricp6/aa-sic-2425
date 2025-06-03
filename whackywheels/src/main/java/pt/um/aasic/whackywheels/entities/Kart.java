package pt.um.aasic.whackywheels.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.util.Set;


@Entity
public class Kart {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    @JsonIgnore
    private Track track;

    @NonNull
    private Integer kartNumber;

    private Boolean isAvailable; // true - available, false - occupied, null - maintenance

    @Column(length = 50)
    private String model;

    @OneToMany(mappedBy = "kart")
    private Set<Participant> participants;

    public Kart() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Track getTrack() {
        return track;
    }

    public void setTrack(Track track) {
        this.track = track;
    }

    public Integer getKartNumber() {
        return kartNumber;
    }

    public void setKartNumber(Integer kartNumber) {
        this.kartNumber = kartNumber;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }
}

