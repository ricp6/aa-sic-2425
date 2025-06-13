package pt.um.aasic.whackywheels.dtos;

import java.time.LocalDate;
import java.util.List;

public class SessionsDetailsResponseDTO {
    private Long sessionId;
    private String trackName;
    private LocalDate date;
    private Integer kartsUsed;
    private String sessionDuration;
    private List<DriverClassificationDTO> classifications;

    public SessionsDetailsResponseDTO(Long sessionId, String trackName, LocalDate date, Integer kartsUsed, String sessionDuration, List<DriverClassificationDTO> classifications) {
        this.sessionId = sessionId;
        this.trackName = trackName;
        this.date = date;
        this.kartsUsed = kartsUsed;
        this.sessionDuration = sessionDuration;
        this.classifications = classifications;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getTrackName() {
        return trackName;
    }

    public LocalDate getDate() {
        return date;
    }

    public Integer getKartsUsed() {
        return kartsUsed;
    }

    public String getSessionDuration() {
        return sessionDuration;
    }

    public List<DriverClassificationDTO> getClassifications() {
        return classifications;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setKartsUsed(Integer kartsUsed) {
        this.kartsUsed = kartsUsed;
    }

    public void setSessionDuration(String sessionDuration) {
        this.sessionDuration = sessionDuration;
    }

    public void setClassifications(List<DriverClassificationDTO> classifications) {
        this.classifications = classifications;
    }
}
