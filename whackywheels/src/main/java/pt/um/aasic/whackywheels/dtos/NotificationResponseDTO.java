package pt.um.aasic.whackywheels.dtos;

import java.time.LocalDateTime;

public class NotificationResponseDTO {
    private Long id;
    private Long userId; // O ID do utilizador que recebeu a notificação
    private String title;
    private String body;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponseDTO() {}

    public NotificationResponseDTO(Long id, Long userId, String title, String body, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.body = body;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public boolean getIsRead() { return isRead; }
    public void setIsRead(boolean read) { isRead = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}