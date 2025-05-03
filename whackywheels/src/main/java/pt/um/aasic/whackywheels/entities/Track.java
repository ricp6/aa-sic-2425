package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private Owner owner;

    @NonNull
    private String name;

    @NonNull
    private String location;

    @NonNull
    @Column(precision = 5, scale = 2) // precision - total number of digits, scale - number of decimal digits
    private BigDecimal slotPrice;

    @NonNull
    private Integer slotDuration; // in minutes

    @OneToMany(mappedBy = "track")
    private Set<TrackSlot> slots;

    @NonNull
    @ElementCollection
    @CollectionTable(
            joinColumns = @JoinColumn(name = "track_id")
    )
    private Set<TrackSchedule> schedule;

    @OneToMany(mappedBy = "track")
    private Set<Kart> karts;

    private String description;

    @Column(length = 50)
    private String email;

    @Column(length = 13)
    private String phone;

    @ElementCollection
    @Column(name = "image_url") // name of the column in the collection table
    private Set<String> images;

    private boolean isAvailable; // true - available, false - temporarily/permanently closed

    @CreationTimestamp
    private LocalDateTime createdAt;

    protected Track() {}

    public Track(@NonNull Owner owner, @NonNull String name, @NonNull String location, @NonNull BigDecimal slotPrice, @NonNull Integer slotDuration, Set<TrackSlot> slots, @NonNull Set<TrackSchedule> schedule, Set<Kart> karts, String description, String email, String phone, Set<String> images, boolean isAvailable) {
        this.owner = owner;
        this.name = name;
        this.location = location;
        this.slotPrice = slotPrice;
        this.slotDuration = slotDuration;
        this.slots = slots;
        this.schedule = schedule;
        this.karts = karts;
        this.description = description;
        this.email = email;
        this.phone = phone;
        this.images = images;
        this.isAvailable = isAvailable;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    @NonNull
    public Owner getOwner() {
        return owner;
    }

    @NonNull
    public String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    @NonNull
    public String getLocation() {
        return location;
    }

    @NonNull
    public BigDecimal getSlotPrice() {
        return slotPrice;
    }

    public void setSlotPrice(@NonNull BigDecimal slotPrice) {
        this.slotPrice = slotPrice;
    }

    @NonNull
    public Integer getSlotDuration() {
        return slotDuration;
    }

    public void setSlotDuration(@NonNull Integer slotDuration) {
        this.slotDuration = slotDuration;
    }

    public Set<TrackSlot> getSlots() {
        return slots;
    }

    public void setSlot(Set<TrackSlot> slots) {
        this.slots = slots;
    }

    @NonNull
    public Set<TrackSchedule> getSchedule() {
        return schedule;
    }

    public void setSchedule(@NonNull Set<TrackSchedule> schedule) {
        this.schedule = schedule;
    }

    public Set<Kart> getKarts() {
        return karts;
    }

    public void setKarts(Set<Kart> karts) {
        this.karts = karts;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getImages() {
        return images;
    }

    public void setImages(Set<String> images) {
        this.images = images;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
