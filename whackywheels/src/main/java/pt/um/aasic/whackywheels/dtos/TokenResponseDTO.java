package pt.um.aasic.whackywheels.dtos;

public class TokenResponseDTO {
    private String accessToken;
    // You could add refreshToken here too if you implement refresh token rotation

    public TokenResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }

    // Getter for accessToken
    public String getAccessToken() {
        return accessToken;
    }

    // Setter for accessToken (optional, if you need to deserialize)
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}