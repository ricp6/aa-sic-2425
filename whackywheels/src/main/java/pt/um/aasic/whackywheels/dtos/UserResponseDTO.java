package pt.um.aasic.whackywheels.dtos;

//Isto é o que mandamos quando fazemos um login
public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String userType;
    private Long unreadNotificationCount;


    public UserResponseDTO(Long id, String email, String name, String userType,Long unreadNotificationCount) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.unreadNotificationCount = unreadNotificationCount;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getUserType() {
        return userType;
    }

    public Long getUnreadNotificationCount() { return unreadNotificationCount; }
    public void setUnreadNotificationCount(Long unreadNotificationCount) { this.unreadNotificationCount = unreadNotificationCount; }
}
