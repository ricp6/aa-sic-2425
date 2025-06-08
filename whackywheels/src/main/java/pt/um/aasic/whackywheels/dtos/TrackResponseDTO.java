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

    // TODO: Add schedule and rankings info

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
}
