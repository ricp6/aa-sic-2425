package pt.um.aasic.whackywheels.dtos;

import java.math.BigDecimal;
import java.util.Set;

public class TrackResponseDTO {
    private Long id;
    private String name;
    private String address;
    private BigDecimal slotPrice;
    private Integer slotDuration;
    private String email;
    private String phoneNumber;
    private Set<String> images; // Lista de URLs das imagens
    private boolean isAvailable;
    private Long ownerId; // Apenas o ID do proprietário, não o objeto completo

    public TrackResponseDTO() {
    }

    public TrackResponseDTO(Long id, String name, String address, BigDecimal slotPrice, Integer slotDuration, String email, String phoneNumber, Set<String> images, boolean isAvailable, Long ownerId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.slotPrice = slotPrice;
        this.slotDuration = slotDuration;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.images = images;
        this.isAvailable = isAvailable;
        this.ownerId = ownerId;
    }

    // Getters and Setters (gerados ou escritos manualmente)

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

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}
