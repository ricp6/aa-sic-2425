package pt.um.aasic.whackywheels.dtos.session;

import java.time.LocalDate;
import java.time.LocalTime;

public class SessionResponseDTO {
    private Long id;
    private String trackName;
    private LocalDate date;
    private Integer numParticipants;
    private Integer position;
    private Double personalRecord;
    private LocalTime startTime;
    private LocalTime endTime;
    private String trackImage;
    
    public SessionResponseDTO(Long id, String trackName, LocalDate date, Integer numParticipants, Integer position, Double personalRecord, LocalTime startTime, LocalTime endTime, String trackImage) {
        this.id = id;
        this.trackName = trackName;
        this.date = date;
        this.numParticipants = numParticipants;
        this.position = position;
        this.personalRecord = personalRecord;
        this.startTime = startTime;
        this.endTime = endTime;
        this.trackImage = trackImage;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTrackName() {
        return trackName;
    }
    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public Integer getNumParticipants() {
        return numParticipants;
    }
    public void setNumParticipants(Integer numParticipants) {
        this.numParticipants = numParticipants;
    }
    public Integer getPosition() {
        return position;
    }
    public void setPosition(Integer position) {
        this.position = position;
    }
    public Double getPersonalRecord() {
        return personalRecord;
    }
    public void setPersonalRecord(Double personalRecord) {
        this.personalRecord = personalRecord;
    }

    public LocalTime getStartTime() {return startTime;}
    public void setStartTime(LocalTime startTime) {this.startTime = startTime;}
    public LocalTime getEndTime() {return endTime;}
    public void setEndTime(LocalTime endTime) {this.endTime = endTime;}
    public String getTrackImage() {return trackImage;}
    public void setTrackImage(String trackImage) {this.trackImage = trackImage;}
}
