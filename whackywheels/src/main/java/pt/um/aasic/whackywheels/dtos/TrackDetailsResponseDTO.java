package pt.um.aasic.whackywheels.dtos;

import java.math.BigDecimal;
import java.util.Set;

public class TrackDetailsResponseDTO {
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

    // TODO: Add schedule and rankings info

    public TrackDetailsResponseDTO() {
    }

    public TrackDetailsResponseDTO(Long id, String name, String address, BigDecimal slotPrice, Integer slotDuration, String email, String phoneNumber, Set<String> images, boolean isAvailable, Long ownerId) {
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

    public Long getId(){return this.id;}

    public String getName(){return this.name;}

    public String getAddress(){return this.address;}
    public BigDecimal getSlotPrice(){return this.slotPrice;}
    public Integer getSlotDuration(){return this.slotDuration;}
    public String getEmail(){return this.email;}
    public String getPhoneNumber(){return this.phoneNumber;}
    public Set<String> getImages(){return this.images;}
    public boolean getIsAvailable(){return this.isAvailable;}
    public Long getOwnerId(){return this.ownerId;}
}
