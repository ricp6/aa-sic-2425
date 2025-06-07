package pt.um.aasic.whackywheels.dtos;

import java.util.List;

public class LoginResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String userType;
    private Long unreadNotificationCount;
    private List<Long> favoriteTrackIds;
    private String token;

    public LoginResponseDTO(Long id, String email, String name, String userType, Long unreadNotificationCount, List<Long> favoriteTrackIds, String token) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.unreadNotificationCount = unreadNotificationCount;
        this.favoriteTrackIds = favoriteTrackIds;
        this.token = token;
    }

    // Getters
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

    public Long getUnreadNotificationCount() {
        return unreadNotificationCount;
    }

    public List<Long> getFavoriteTrackIds() {
        return favoriteTrackIds;
    }

    public String getToken() {
        return token;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public void setUnreadNotificationCount(Long unreadNotificationCount) {
        this.unreadNotificationCount = unreadNotificationCount;
    }

    public void setFavoriteTrackIds(List<Long> favoriteTrackIds) {
        this.favoriteTrackIds = favoriteTrackIds;
    }

    public void setToken(String token) {
        this.token = token;
    }
}