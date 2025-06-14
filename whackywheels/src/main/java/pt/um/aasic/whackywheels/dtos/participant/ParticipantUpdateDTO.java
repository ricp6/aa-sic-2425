package pt.um.aasic.whackywheels.dtos.participant;

import jakarta.validation.constraints.NotNull;

public class ParticipantUpdateDTO {

    private Long participantId;
    @NotNull(message = "User ID is mandatory for participant")
    private Long userId;
    private Long kartId;

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getKartId() {
        return kartId;
    }

    public void setKartId(Long kartId) {
        this.kartId = kartId;
    }
}