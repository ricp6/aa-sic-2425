package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @NonNull
    private Owner owner;

    @NonNull
    private String name;

    @NonNull
    private String location;

    private String description;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackSchedule> schedules = new ArrayList<>();

    private boolean isAvailable;

    @CreationTimestamp
    private Date createdAt;

}
