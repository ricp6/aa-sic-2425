package pt.um.aasic.whackywheels.dtos;

import java.util.List;

public class UserProfileDTO {
    private String name;
    private String email;
    private String role;
    private int totalSessions;
    private int victories;
    private int tracksVisited;
    private List<String> favoriteTracks;
    private String profilePicture;

    public UserProfileDTO() {
    }

    public UserProfileDTO(String name, String email, String role, int totalSessions, int victories, int tracksVisited, List<String> favoriteTracks, String profilePicture) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.totalSessions = totalSessions;
        this.victories = victories;
        this.tracksVisited = tracksVisited;
        this.favoriteTracks = favoriteTracks;
        this.profilePicture = profilePicture;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) { this.totalSessions = totalSessions; }

    public int getVictories() { return victories; }
    public void setVictories(int victories) { this.victories = victories; }

    public int getTracksVisited() { return tracksVisited; }
    public void setTracksVisited(int tracksVisited) { this.tracksVisited = tracksVisited; }

    public List<String> getFavoriteTracks() { return favoriteTracks; }
    public void setFavoriteTracks(List<String> favoriteTracks) { this.favoriteTracks = favoriteTracks; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture;}
}



