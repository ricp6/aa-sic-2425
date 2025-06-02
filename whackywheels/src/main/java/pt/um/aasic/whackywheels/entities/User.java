package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.util.HashSet;
import java.util.Set;

@Entity
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @Column(length = 50, nullable = false)
    private String name;

    @NonNull
    @Column(unique = true, length = 70)
    private String email;

    @NonNull
    @Column(nullable = false)
    private String password; // hashed

    private String profilePicture;

    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications;

    @NonNull
    @ManyToMany
    @JoinTable(
            name = "user_favorite_tracks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    private Set<Track> favoriteTracks;

    protected User() {}

}
