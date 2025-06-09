package pt.um.aasic.whackywheels.dtos;

public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String userType;

    public UserResponseDTO(Long id, String username, String email, String userType) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.userType = userType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
