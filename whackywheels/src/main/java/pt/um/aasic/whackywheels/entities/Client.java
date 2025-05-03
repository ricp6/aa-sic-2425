package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import org.springframework.lang.NonNull;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Client extends User {

    @NonNull
    @ManyToMany
    @JoinTable(
            name = "favorite_tracks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    private Set<Track> favTracks;

    /*
    private Set<Session> sessions;

    private Set<Reservation> reservations;
*/
    protected Client() {}

    public Client(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        super(password, email, name, profilePicture);
        this.favTracks = new HashSet<>();
    }

    @NonNull
    public Set<Track> getFavTracks() {
        return favTracks;
    }

    public void setFavTracks(@NonNull Set<Track> favTracks) {
        this.favTracks = favTracks;
    }

    public void addFavTrack(@NonNull Track track) {
        this.favTracks.add(track);
    }

    public void removeFavTrack(@NonNull Track track) {
        this.favTracks.remove(track);
    }
}
