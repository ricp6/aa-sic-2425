package pt.um.aasic.whackywheels.dtos;

public class NotificationMessageDTO {
    private String message;

    public NotificationMessageDTO() {
    }
    public NotificationMessageDTO(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
