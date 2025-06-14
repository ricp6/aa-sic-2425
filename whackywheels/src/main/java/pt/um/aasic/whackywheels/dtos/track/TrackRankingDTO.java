package pt.um.aasic.whackywheels.dtos.track;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TrackRankingDTO {
    private String driverName;
    private LocalDate date; // Use LocalDate for just the date
    private String kartNumber; // Assuming Kart has a kartNumber field
    private Double lapTime; // Use Double for lap time

    public TrackRankingDTO() {}

    // Constructor that takes LocalDateTime for the date, and converts it to LocalDate
    public TrackRankingDTO(String driverName, LocalDateTime dateTime, String kartNumber, Double lapTime) {
        this.driverName = driverName;
        this.date = dateTime != null ? dateTime.toLocalDate() : null; // Convert LocalDateTime to LocalDate
        this.kartNumber = kartNumber;
        this.lapTime = lapTime;
    }

    // Original constructor (if you want to keep it for other uses)
    public TrackRankingDTO(String driverName, LocalDate date, String kartNumber, Double lapTime) {
        this.driverName = driverName;
        this.date = date;
        this.kartNumber = kartNumber;
        this.lapTime = lapTime;
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

    public String getKartNumber() {
        return kartNumber;
    }

    public void setKartNumber(String kartNumber) {
        this.kartNumber = kartNumber;
    }

    public Double getLapTime() {
        return lapTime;
    }

    public void setLapTime(Double lapTime) {
        this.lapTime = lapTime;
    }
}