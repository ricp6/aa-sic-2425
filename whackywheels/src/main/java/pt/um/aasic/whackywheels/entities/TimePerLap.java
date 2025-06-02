package pt.um.aasic.whackywheels.entities;
import jakarta.persistence.*;

@Entity
public class TimePerLap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int lap;

    private Double lapTime;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    protected TimePerLap() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLapTime() {
        return lapTime;
    }

    public void setLapTime(Double lapTime) {
        this.lapTime = lapTime;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
