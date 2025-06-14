package pt.um.aasic.whackywheels.dtos.session;

import java.time.LocalDate;
import java.util.List;

public class SessionsDetailsResponseDTO {
    private Long id;
    private String trackName;
    private LocalDate date;
    private String sessionDuration;
    private List<DriverClassificationDTO> classifications;

    public SessionsDetailsResponseDTO(Long id, String trackName, LocalDate date, String sessionDuration, List<DriverClassificationDTO> classifications) {
        this.id = id;
        this.trackName = trackName;
        this.date = date;
        this.sessionDuration = sessionDuration;
        this.classifications = classifications;
    }

    public Long getId() {
        return id;
    }

    public String getTrackName() {
        return trackName;
    }

    public LocalDate getDate() {
        return date;
    }


    public String getSessionDuration() {
        return sessionDuration;
    }

    public List<DriverClassificationDTO> getClassifications() {
        return classifications;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setSessionDuration(String sessionDuration) {
        this.sessionDuration = sessionDuration;
    }

    public void setClassifications(List<DriverClassificationDTO> classifications) {
        this.classifications = classifications;
    }
}
