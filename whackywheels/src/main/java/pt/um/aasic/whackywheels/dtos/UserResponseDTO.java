package pt.um.aasic.whackywheels.dtos;

import java.util.List;
//Isto é o que mandamos quando fazemos um login
public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String userType;
    private Long unreadNotificationCount;
    private List<Long> favoriteTrackIds;


    public UserResponseDTO(Long id, String email, String name, String userType,Long unreadNotificationCount,List<Long> favoriteTrackIds) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.unreadNotificationCount = unreadNotificationCount;
        this.favoriteTrackIds = favoriteTrackIds;
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

    public List<Long> getFavoriteTrackIds() {
        return favoriteTrackIds;
    }

    public void setFavoriteTrackIds(List<Long> favoriteTrackIds) {
        this.favoriteTrackIds = favoriteTrackIds;
    }


}
