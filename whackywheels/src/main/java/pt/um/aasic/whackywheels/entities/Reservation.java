package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.lang.NonNull;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @NonNull
    private Track track;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ReservationParticipant> participants = new HashSet<>();

    @NonNull
    private Date startTime;

    @NonNull
    private Date endTime;


    public enum ReservationStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        CONCLUDED
    }

    @Enumerated(EnumType.STRING)
    @NonNull
    private ReservationStatus status;

    protected Reservation() {}

    public Reservation(@NonNull Track track, Set<ReservationParticipant> participants, @NonNull Date startTime, @NonNull Date endTime) {
        this.track = track;
        this.participants = participants;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = ReservationStatus.PENDING;
    }

    @NonNull
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(@NonNull Date endTime) {
        this.endTime = endTime;
    }

    @NonNull
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(@NonNull Date startTime) {
        this.startTime = startTime;
    }

    public Set<ReservationParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<ReservationParticipant> participants) {
        this.participants = participants;
    }

    public Track getTrack() {
        return track;
    }

    public void setTrack(Track track) {
        this.track = track;
    }

    @NonNull
    public ReservationStatus getStatus() {
        return status;
    }
}
