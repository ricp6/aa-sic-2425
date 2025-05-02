package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.lang.NonNull;

import java.util.Date;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @Column(length = 100)
    private String title;

    @NonNull
    private String body;

    private boolean read;

    @CreationTimestamp
    private Date createdAt;

    protected Notification() {}

    public Notification(@NonNull String body, @NonNull String title) {
        this.body = body;
        this.title = title;
        this.read = false;
    }

    @NonNull
    public String getTitle() {
        return title;
    }

    @NonNull
    public String getBody() {
        return body;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
}
