package pt.um.aasic.whackywheels.dtos;

public class LapTimeRequestDTO {
    private Long participantId;
    private Double lapTime;

    // Constructors
    public LapTimeRequestDTO() {}

    public LapTimeRequestDTO(Long participantId, Double lapTime) {
        this.participantId = participantId;
        this.lapTime = lapTime;
    }

    // Getters and Setters
    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public Double getLapTime() {
        return lapTime;
    }

    public void setLapTime(Double lapTime) {
        this.lapTime = lapTime;
    }
}
