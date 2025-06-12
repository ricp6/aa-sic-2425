package pt.um.aasic.whackywheels.dtos;

import pt.um.aasic.whackywheels.entities.ReservationStatus;

import java.time.LocalDate;

public class ReservationResponseDTO {
    private Long id;
    private LocalDate reservationDate;
    private ReservationStatus status;
    private String trackName;
    private Integer numSessions;
    private Integer numParticipants;
    private String trackImage;
    private Long createdByUserId;

    public ReservationResponseDTO() {}

    public ReservationResponseDTO(Long id, LocalDate reservationDate, ReservationStatus status, String trackName, String trackImage, Integer numSessions, Integer numParticipants, Long createdByUserId) {
        this.id = id;
        this.reservationDate = reservationDate;
        this.status = status;
        this.trackName = trackName;
        this.trackImage = trackImage;
        this.numSessions = numSessions;
        this.numParticipants = numParticipants;
        this.createdByUserId = createdByUserId;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getReservationDate() {
        return reservationDate;
    }
    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }
    public ReservationStatus getStatus() {
        return status;
    }
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
    public String getTrackName() {
        return trackName;
    }
    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }
    public String getTrackImage() {
        return trackImage;
    }
    public void setTrackImage(String trackImage) {
        this.trackImage = trackImage;
    }
    public Integer getNumSessions() {
        return numSessions;
    }
    public void setNumSessions(Integer numSessions) {
        this.numSessions = numSessions;
    }
    public Integer getNumParticipants() {
        return numParticipants;
    }
    public void setNumParticipants(Integer numParticipants) {
        this.numParticipants = numParticipants;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }
    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }


}
