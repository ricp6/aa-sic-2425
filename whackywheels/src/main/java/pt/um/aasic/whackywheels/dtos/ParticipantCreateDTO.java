package pt.um.aasic.whackywheels.dtos;

import jakarta.validation.constraints.NotNull;

public class ParticipantCreateDTO {

    @NotNull(message = "User ID for participant is mandatory")
    private Long userId;

    private Long kartId;

    public ParticipantCreateDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getKartId() { return kartId; }
    public void setKartId(Long kartId) { this.kartId = kartId; }
}
