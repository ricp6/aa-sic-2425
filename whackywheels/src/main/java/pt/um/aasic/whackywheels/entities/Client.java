package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import org.springframework.lang.NonNull;

import java.util.List;

@Entity
public class Client extends User {

    /*
    private List<Track> favTracks;

    private List<Session> sessions;

    private List<Reservation> reservations;
*/
    protected Client() {}

    public Client(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        super(password, email, name, profilePicture);
    }
}
