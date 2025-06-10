package pt.um.aasic.whackywheels.dtos;

public class KartResponseDTO {
    private Long id;
    private Integer kartNumber;
    private String model;
    private Boolean isAvailable;
    private Long trackId;
    private String trackName;

    public KartResponseDTO(Long id, Integer kartNumber, String model, Boolean isAvailable, Long trackId, String trackName) {
        this.id = id;
        this.kartNumber = kartNumber;
        this.model = model;
        this.isAvailable = isAvailable;
        this.trackId = trackId;
        this.trackName = trackName;
    }

    public Long getId() { return id; }
    public Integer getKartNumber() { return kartNumber; }
    public String getModel() { return model; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Long getTrackId() { return trackId; }
    public String getTrackName() { return trackName; }

    public void setId(Long id) { this.id = id; }
    public void setKartNumber(Integer kartNumber) { this.kartNumber = kartNumber; }
    public void setModel(String model) { this.model = model; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }
    public void setTrackId(Long trackId) { this.trackId = trackId; }
    public void setTrackName(String trackName) { this.trackName = trackName; }
}