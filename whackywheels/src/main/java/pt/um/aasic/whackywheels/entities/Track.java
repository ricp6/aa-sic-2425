package pt.um.aasic.whackywheels.entities;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(precision = 5, scale = 2, nullable = false) // precision - total number of digits, scale - number of decimal digits
    private BigDecimal slotPrice;

    @Column(nullable = false)
    private Integer slotDuration;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 13)
    private String phoneNumber;

    @ElementCollection
    @Column(name = "image_url")
    private Set<String> images = new HashSet<>();

    private boolean isAvailable; // true - available, false - temporarily/permanently closed

    @NonNull
    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private Owner owner;

    @OneToMany(mappedBy = "track")
    private Set<DaySchedule> daySchedules;

    @OneToMany(mappedBy = "track")
    private Set<Reservation> reservations;

    @OneToMany(mappedBy = "track")
    private Set<Kart> karts;

    @ManyToMany(mappedBy = "favoriteTracks")
    private Set<User> favoritedByUsers;

    public Track() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getSlotPrice() {
        return slotPrice;
    }

    public void setSlotPrice(BigDecimal slotPrice) {
        this.slotPrice = slotPrice;
    }

    public Integer getSlotDuration() {
        return slotDuration;
    }

    public void setSlotDuration(Integer slotDuration) {
        this.slotDuration = slotDuration;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Set<String> getImages() {
        return images;
    }

    public void setImages(Set<String> images) {
        this.images = images;
    }

    public boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Set<DaySchedule> getDaySchedules() {
        return daySchedules;
    }

    public void setDaySchedules(Set<DaySchedule> daySchedules) {
        this.daySchedules = daySchedules;
    }

    public Set<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        this.reservations = reservations;
    }

    public Set<Kart> getKarts() {
        return karts;
    }

    public void setKarts(Set<Kart> karts) {
        this.karts = karts;
    }
}
