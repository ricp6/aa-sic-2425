package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class TrackSchedule {
    public enum DayOfWeek {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Track track;

    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

    @NonNull
    private LocalTime openingTime;

    @NonNull
    private LocalTime closingTime;

    private int slotDuration;
}
