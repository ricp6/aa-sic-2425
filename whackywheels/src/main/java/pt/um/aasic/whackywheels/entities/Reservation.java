package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    /*
    /// ///////////////////////////////////////////
    @NonNull
    @ManyToOne
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    private Track track;

    @NonNull
    private LocalDate date;

    @NonNull
    private LocalDateTime startTime;

    @NonNull
    private LocalDateTime endTime;

    /// //////////////////////////////////////////
*/
    @NonNull
    @OneToMany
    private Set<TrackSlot> slots;

    /// /////////////////////////////////////////

    @OneToMany(mappedBy = "reservation")
    private Set<ReservationParticipant> participants = new HashSet<>();

    @NonNull
    @Enumerated(EnumType.ORDINAL) // maps the enum value to an int, saves space on the table
    private ReservationStatus status;

    protected Reservation() {}

    public Reservation(@NonNull Track track, @NonNull LocalDateTime startTime, @NonNull LocalDateTime endTime, Set<ReservationParticipant> participants, Set<TrackSlot> slots) {
        /*this.track = track;
        this.startTime = startTime;
        this.endTime = endTime;*/
        this.slots = slots;
        this.participants = participants;
        this.status = ReservationStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    @NonNull
    public Set<TrackSlot> getSlots() {
        return slots;
    }

    public void setSlots(@NonNull Set<TrackSlot> slots) {
        this.slots = slots;
    }

    /*
    @NonNull
    public Track getTrack() {
        return track;
    }

    public void setTrack(@NonNull Track track) {
        this.track = track;
    }

    @NonNull
    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@NonNull LocalDateTime startTime) {
        this.startTime = startTime;
    }

    @NonNull
    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(@NonNull LocalDateTime endTime) {
        this.endTime = endTime;
    }*/

    public Set<ReservationParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<ReservationParticipant> participants) {
        this.participants = participants;
    }

    @NonNull
    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(@NonNull ReservationStatus status) { this.status = status; }
}
