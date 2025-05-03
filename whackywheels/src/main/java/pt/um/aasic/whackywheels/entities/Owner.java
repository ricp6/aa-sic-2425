package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import org.springframework.lang.NonNull;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Owner extends User {

    @NonNull
    @OneToMany(mappedBy = "owner")
    private Set<Track> tracks;

    protected Owner() {}

    public Owner(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        super(password, email, name, profilePicture);
        this.tracks = new HashSet<>();
    }

    @NonNull
    public Set<Track> getTracks() {
        return tracks;
    }

    public void setTracks(@NonNull Set<Track> tracks) {
        this.tracks = tracks;
    }

    public void addTrack(@NonNull Track track) {
        this.tracks.add(track);
    }

    public void removeTrack(@NonNull Track track) {
        this.tracks.remove(track);
    }
}
