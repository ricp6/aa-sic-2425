package pt.um.aasic.whackywheels.dtos;

public class ParticipantResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long kartId;
    private Integer kartNumber;

    public ParticipantResponseDTO() {}

    public ParticipantResponseDTO(Long id, Long userId, String userName, Long kartId, Integer kartNumber) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.kartId = kartId;
        this.kartNumber = kartNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Long getKartId() { return kartId; }
    public void setKartId(Long kartId) { this.kartId = kartId; }
    public Integer getKartNumber() { return kartNumber; }
    public void setKartNumber(Integer kartNumber) { this.kartNumber = kartNumber; }
}
