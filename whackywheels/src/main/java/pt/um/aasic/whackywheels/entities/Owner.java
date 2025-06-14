package pt.um.aasic.whackywheels.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.DiscriminatorValue;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.HashSet;
import java.util.Set;
import java.util.Collection;
import java.util.Collections;

@Entity
@DiscriminatorValue("OWNER")
public class Owner extends User {
    //O JsonIgnore serve para na criação se responder com track n haver um loop de ligações e mostar um json enorme
    //Mais tarde fizermos um trackResponseDTO podemos tirar.
    @NonNull
    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private Set<Track> tracks = new HashSet<>();

    public Owner() {
        super();
        this.userType = "OWNER";
    }

    public Set<Track> getTracks() {
        return tracks;
    }

    public void setTracks(Set<Track> tracks) {
        this.tracks = tracks;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_OWNER"));
    }
}
