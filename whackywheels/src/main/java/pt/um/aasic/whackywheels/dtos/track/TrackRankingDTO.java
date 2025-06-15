package pt.um.aasic.whackywheels.dtos.track;

import java.time.LocalDate;

public class TrackRankingDTO {
    private String driverName;
    private LocalDate date; // Use LocalDate for just the date
    private Integer kartNumber; // Assuming Kart has a kartNumber field
    private Double lapTime; // Use Double for lap time
    private String profilePicture;

    public TrackRankingDTO() {}

    // Original constructor (if you want to keep it for other uses)
    public TrackRankingDTO(String driverName, LocalDate date, Integer kartNumber, Double lapTime, String profilePicture) {
        this.driverName = driverName;
        this.date = date;
        this.kartNumber = kartNumber;
        this.lapTime = lapTime;
        this.profilePicture = profilePicture;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getKartNumber() {
        return kartNumber;
    }

    public void setKartNumber(Integer kartNumber) {
        this.kartNumber = kartNumber;
    }

    public Double getLapTime() {
        return lapTime;
    }

    public void setLapTime(Double lapTime) {
        this.lapTime = lapTime;
    }

    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}