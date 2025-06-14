package pt.um.aasic.whackywheels.dtos.track; // Your DTO package

import java.math.BigDecimal;
import java.util.Set;
import java.util.List; // For rankings, a List might be better to maintain order

public class TrackDetailsResponseDTO {
    private Long id;
    private String name;
    private String address;
    private BigDecimal slotPrice;
    private Integer slotDuration;
    private String email;
    private String phoneNumber;
    private Set<String> images;
    private boolean isAvailable;
    private Long ownerId;

    // --- NEW FIELDS ---
    private Integer availableKartsCount; // Count of karts available
    private Set<DayScheduleDTO> schedule; // Track's operating hours
    private List<TrackRankingDTO> rankings; // Top rankings for the track

    // Note: If you need to expose the different pricing options (15min, 30min, 1hour)
    // and they are NOT derived from slotPrice/slotDuration, you'd need another DTO/structure here.
    // For now, I'll assume they are derived or that `slotPrice` and `slotDuration` are the only config.

    public TrackDetailsResponseDTO() {
    }

    // Updated Constructor
    public TrackDetailsResponseDTO(
            Long id, String name, String address, BigDecimal slotPrice, Integer slotDuration,
            String email, String phoneNumber, Set<String> images, boolean isAvailable, Long ownerId,
            Integer availableKartsCount, Set<DayScheduleDTO> schedule, List<TrackRankingDTO> rankings) {
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
        this.availableKartsCount = availableKartsCount;
        this.schedule = schedule;
        this.rankings = rankings;
    }

    // Existing Getters (no change needed here)
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

    // --- NEW GETTERS AND SETTERS ---
    public Integer getAvailableKartsCount() {
        return availableKartsCount;
    }

    public void setAvailableKartsCount(Integer availableKartsCount) {
        this.availableKartsCount = availableKartsCount;
    }

    public Set<DayScheduleDTO> getSchedule() {
        return schedule;
    }

    public void setSchedule(Set<DayScheduleDTO> schedule) {
        this.schedule = schedule;
    }

    public List<TrackRankingDTO> getRankings() {
        return rankings;
    }

    public void setRankings(List<TrackRankingDTO> rankings) {
        this.rankings = rankings;
    }
}