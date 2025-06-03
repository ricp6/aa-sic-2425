package pt.um.aasic.whackywheels.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public class TrackCreateRequestDTO {

    @NotBlank(message = "Track name cannot be empty")
    @Size(max = 255, message = "Track name cannot exceed 255 characters")
    private String name;

    @NotBlank(message = "Address cannot be empty")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @NotNull(message = "Slot price cannot be null")
    @DecimalMin(value = "0.01", message = "Slot price must be greater than 0")
    @Digits(integer = 5, fraction = 2, message = "Slot price format invalid (max 5 digits, 2 decimal)")
    private BigDecimal slotPrice;

    @NotNull(message = "Slot duration cannot be null")
    @Min(value = 1, message = "Slot duration must be at least 1 minute")
    private Integer slotDuration;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^\\+?[0-9]{9,13}$", message = "Phone number must be between 9 and 13 digits and can start with '+'")
    private String phoneNumber;

    // @Nullable para imagens, pois o owner pode não as enviar
    private Set<String> images;

    @Valid // Valida a lista de DayScheduleDTOs
    @NotNull(message = "Day schedules cannot be null")
    @Size(min = 1, message = "At least one day schedule must be provided")
    private Set<DayScheduleDTO> daySchedules; // Usar Set para garantir unicidade por dia

    @Valid // Valida a lista de KartDTOs
    @NotNull(message = "Karts cannot be null")
    @Size(min = 1, message = "At least one kart must be provided")
    private Set<KartDTO> karts; // Usar Set para karts

    public TrackCreateRequestDTO() {}

    public TrackCreateRequestDTO(String name, String address, BigDecimal slotPrice, Integer slotDuration, String email, String phoneNumber, Set<String> images, Set<DayScheduleDTO> daySchedules, Set<KartDTO> karts) {
        this.name = name;
        this.address = address;
        this.slotPrice = slotPrice;
        this.slotDuration = slotDuration;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.images = images;
        this.daySchedules = daySchedules;
        this.karts = karts;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public BigDecimal getSlotPrice() { return slotPrice; }
    public void setSlotPrice(BigDecimal slotPrice) { this.slotPrice = slotPrice; }
    public Integer getSlotDuration() { return slotDuration; }
    public void setSlotDuration(Integer slotDuration) { this.slotDuration = slotDuration; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Set<String> getImages() { return images; }
    public void setImages(Set<String> images) { this.images = images; }
    public Set<DayScheduleDTO> getDaySchedules() { return daySchedules; }
    public void setDaySchedules(Set<DayScheduleDTO> daySchedules) { this.daySchedules = daySchedules; }
    public Set<KartDTO> getKarts() { return karts; }
    public void setKarts(Set<KartDTO> karts) { this.karts = karts; }
}
