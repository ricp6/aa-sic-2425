package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.DiscriminatorValue;
import org.springframework.lang.NonNull;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("OWNER")
public class Owner extends User {

    @NonNull
    @OneToMany(mappedBy = "owner")
    private Set<Track> tracks;

    protected Owner() {
        super();
    }

    public Set<Track> getTracks() {
        return tracks;
    }

    public void setTracks(Set<Track> tracks) {
        this.tracks = tracks;
    }
}
