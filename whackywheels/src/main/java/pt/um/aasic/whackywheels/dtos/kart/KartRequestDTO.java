package pt.um.aasic.whackywheels.dtos.kart;

public class KartRequestDTO {
    private boolean isAvailable;
    private String model;
    private Long trackId;
    private Integer kartNumber;

    public KartRequestDTO() {}

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    public String getModel() {
        return model;
    }
    public void setModel(String model) {
        this.model = model;
    }
    public Long getTrackId() {
        return trackId;
    }
    public void setTrackId(Long trackId) {
        this.trackId = trackId;
    }
    public Integer getKartNumber() {
        return kartNumber;
    }
    public void setKartNumber(Integer kartNumber) {
        this.kartNumber = kartNumber;
    }

}
