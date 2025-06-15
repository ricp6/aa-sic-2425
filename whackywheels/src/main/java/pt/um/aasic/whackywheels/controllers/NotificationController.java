package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import pt.um.aasic.whackywheels.dtos.NotificationCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.NotificationResponseDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.NotificationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(@Valid @RequestBody NotificationCreateRequestDTO request) {
        try {
            NotificationResponseDTO newNotification = notificationService.createNotification(request);
            log.info("Notification created successfully: {}", newNotification);
            return new ResponseEntity<>(newNotification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            log.error("Error creating notification: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error creating notification: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotificationsForUser(@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();

            List<NotificationResponseDTO> notifications = notificationService.getAllNotificationsForUser(userId);
            log.info("Fetched notifications for user {}: {}", userId, notifications);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching notifications: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<NotificationResponseDTO> markNotificationAsRead(@PathVariable Long id,@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();
            NotificationResponseDTO updatedNotification = notificationService.markNotificationAsRead(id, userId);
            log.info("Notification {} marked as read for user {}: {}", id, userId, updatedNotification);
            return ResponseEntity.ok(updatedNotification);
        } catch (IllegalArgumentException e) {
            log.error("Error marking notification as read: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();

            boolean deleted = notificationService.deleteNotification(id, userId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.OK);
            }
            log.warn("Notification with id {} not found for user {}", id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            log.error("Error deleting notification: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error deleting notification: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/read")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<Void> deleteReadNotifications(@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();

            notificationService.deleteReadNotifications(userId);
            log.info("Deleted all read notifications for user {}", userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error deleting read notifications: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/mark-all-read")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<Void> markAllNotificationsAsRead(@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();

            notificationService.markAllNotificationsAsRead(userId);
            log.info("Marked all notifications as read for user {}", userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error marking all notifications as read: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
