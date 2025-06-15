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
    private String refreshToken;
    private String profilePicture;

    public LoginResponseDTO(Long id, String email, String name, String userType, Long unreadNotificationCount, List<Long> favoriteTrackIds, String token, String refreshToken, String profilePicture) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.unreadNotificationCount = unreadNotificationCount;
        this.favoriteTrackIds = favoriteTrackIds;
        this.token = token;
        this.refreshToken = refreshToken;
        this.profilePicture = profilePicture;
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

    public String getRefreshToken() {return this.refreshToken;}

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

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setProfilePicture(String profilePicture) {this.profilePicture = profilePicture;}
    public String getProfilePicture() {return profilePicture;}
}