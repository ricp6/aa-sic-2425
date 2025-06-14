package pt.um.aasic.whackywheels.dtos;

public class DriverClassificationDTO {
    private String driverName;
    private Integer kartNumber;
    private String driverPicture;
    private Integer totalLaps;
    private Double averageLapTime;
    private Double bestLapTime;
    private Integer finalPosition;

    public DriverClassificationDTO(String driverName, Integer totalLaps, Double averageLapTime, Double bestLapTime, Integer finalPosition, Integer kartNumber, String driverPicture) {
        this.driverName = driverName;
        this.totalLaps = totalLaps;
        this.averageLapTime = averageLapTime;
        this.bestLapTime = bestLapTime;
        this.finalPosition = finalPosition;
        this.kartNumber = kartNumber;
        this.driverPicture = driverPicture;
    }

    // Getters
    public String getDriverName() {
        return driverName;
    }

    public Integer getTotalLaps() {
        return totalLaps;
    }

    public Double getAverageLapTime() {
        return averageLapTime;
    }

    public Double getBestLapTime() {
        return bestLapTime;
    }

    public Integer getFinalPosition() {
        return finalPosition;
    }

    // Setters (optional)
    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public void setTotalLaps(Integer totalLaps) {
        this.totalLaps = totalLaps;
    }

    public void setAverageLapTime(Double averageLapTime) {
        this.averageLapTime = averageLapTime;
    }

    public void setBestLapTime(Double bestLapTime) {
        this.bestLapTime = bestLapTime;
    }

    public void setFinalPosition(Integer finalPosition) {
        this.finalPosition = finalPosition;
    }

    public Integer getKartNumber() {return this.kartNumber;}
    public String getDriverPicture() {return this.driverPicture;}
    
    public void setKartNumber(Integer kartNumber) {this.kartNumber = kartNumber;}
    public void setDriverPicture(String driverPicture) {this.driverPicture = driverPicture;}
    
}