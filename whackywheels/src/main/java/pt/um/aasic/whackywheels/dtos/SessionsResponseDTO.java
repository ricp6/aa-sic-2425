package pt.um.aasic.whackywheels.dtos;

import java.time.LocalDate;

public class SessionsResponseDTO {
    private Long id;
    private String trackName;
    private LocalDate date;
    private Integer numParticipants;
    private Integer position;
    private Double personalRecord;

    
    public SessionsResponseDTO(Long id, String trackName, LocalDate date, Integer numParticipants, Integer position, Double personalRecord) {
        this.id = id;
        this.trackName = trackName;
        this.date = date;
        this.numParticipants = numParticipants;
        this.position = position;
        this.personalRecord = personalRecord;
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
}
