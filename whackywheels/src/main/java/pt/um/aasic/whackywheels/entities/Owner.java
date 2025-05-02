package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import org.springframework.lang.NonNull;

import java.util.List;

@Entity
public class Owner extends User {

    @OneToMany(mappedBy = "owner")
    private List<Track> tracksList;

    protected Owner() {}

    public Owner(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        super(password, email, name, profilePicture);
    }
}
