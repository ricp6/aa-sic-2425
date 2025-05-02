package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Client extends User {

    @NonNull
    @ManyToMany
    @JoinTable(
            name = "favorite_tracks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    private List<Track> favTracks;

    /*
    private List<Session> sessions;

    private List<Reservation> reservations;
*/
    protected Client() {}

    public Client(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        super(password, email, name, profilePicture);
        this.favTracks = new ArrayList<>();
    }
}
