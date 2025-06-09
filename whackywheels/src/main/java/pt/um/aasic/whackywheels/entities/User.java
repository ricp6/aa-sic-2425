package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

import java.util.Set;
import java.util.HashSet;


@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public class User implements UserDetails {

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

    @Column(name = "user_type", insertable = false, updatable = false)
    protected String userType;

    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications = new HashSet<>();

    @NonNull
    @ManyToMany
    @JoinTable(
            name = "user_favorite_tracks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "track_id")
    )
    private Set<Track> favoriteTracks;

    // Campos para el perfil
    private int totalSessions;
    private int victories;
    private int tracksVisited;

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePic) {
        this.profilePicture = profilePic;
    }

    public Set<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(Set<Notification> notifications) {
        this.notifications = notifications;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = (this instanceof Owner) ? "ROLE_OWNER" : "ROLE_USER";
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    public Set<Track> getFavoriteTracks() {
        return favoriteTracks;
    }
    public void setFavoriteTracks(Set<Track> favoriteTracks) {
        this.favoriteTracks = favoriteTracks;
    }

    //Nesta caso é o email
    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public int getTotalSessions() {return totalSessions;}

    public void setTotalSessions(int totalSessions) {this.totalSessions = totalSessions;}

    public int getVictories() {return victories;}

    public void setVictories(int victories) {this.victories = victories;}

    public int getTracksVisited() {return tracksVisited;}

    public void setTracksVisited(int tracksVisited) {this.tracksVisited = tracksVisited;}


}
