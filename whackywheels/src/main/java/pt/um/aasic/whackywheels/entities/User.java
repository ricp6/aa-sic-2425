package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @Column(length = 50)
    private String name;

    @NonNull
    @Column(unique = true, length = 50)
    private String email;

    @NonNull
    private String password; // hashed

    private String profilePicture;

    @NonNull
    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications;

    protected User() {}

    protected User(@NonNull String password, @NonNull String email, @NonNull String name, String profilePicture) {
        this.password = password;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.notifications = new HashSet<>();
    }

    public Long getId() {
        return id;
    }

    @NonNull
    public String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    @NonNull
    public String getEmail() {
        return email;
    }

    public void setEmail(@NonNull String email) {
        this.email = email;
    }

    @NonNull
    public String getPassword() {
        return password;
    }

    public void setPassword(@NonNull String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    @NonNull
    public Set<Notification> getNotifications() {
        return notifications;
    }

    public void addNotification(@NonNull Notification notification) {
        this.notifications.add(notification);
    }

    public void removeNotification(@NonNull Notification notification) {
        this.notifications.remove(notification);
    }

    public void removeAllNotifications() {
        this.notifications.clear();
    }
}
