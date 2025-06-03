package pt.um.aasic.whackywheels.dtos;

public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String userType;


    public UserResponseDTO(Long id, String email, String name, String userType) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userType = userType;
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
}
