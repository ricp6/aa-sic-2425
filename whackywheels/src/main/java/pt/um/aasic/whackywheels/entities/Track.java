package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private Double slotPrice;

    @NonNull
    private Integer slotDuration;

    @OneToMany(mappedBy = "track")
    private List<TrackSlot> slots;

    @OneToMany(mappedBy = "track")
    private List<TrackSchedule> schedule;

    @OneToMany(mappedBy = "track")
    private List<Kart> karts;

    private String description;

    @Column(length = 50)
    private String email;

    @Column(length = 13)
    private String phone;

    @ElementCollection
    @Column(name = "image_url") // name of the column in the collection table
    private List<String> images;

    private boolean isAvailable;

    @CreationTimestamp
    private Date createdAt;

    protected Track() {}

    public Track(@NonNull Owner owner, @NonNull String name, @NonNull String location, @NonNull Double slotPrice, @NonNull Integer slotDuration, List<TrackSlot> slots, List<TrackSchedule> schedule, List<Kart> karts, String description, String email, String phone, List<String> images, boolean isAvailable) {
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
    }

    @NonNull
    public String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    @NonNull
    public Double getSlotPrice() {
        return slotPrice;
    }

    public void setSlotPrice(@NonNull Double slotPrice) {
        this.slotPrice = slotPrice;
    }

    @NonNull
    public Integer getSlotDuration() {
        return slotDuration;
    }

    public void setSlotDuration(@NonNull Integer slotDuration) {
        this.slotDuration = slotDuration;
    }

    public List<TrackSlot> getSlots() {
        return slots;
    }

    public void setSlot(List<TrackSlot> slots) {
        this.slots = slots;
    }

    public List<TrackSchedule> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<TrackSchedule> schedule) {
        this.schedule = schedule;
    }

    public List<Kart> getKarts() {
        return karts;
    }

    public void setKarts(List<Kart> karts) {
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

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}
