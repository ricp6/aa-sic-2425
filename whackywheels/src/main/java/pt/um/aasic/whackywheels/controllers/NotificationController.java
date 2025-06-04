package pt.um.aasic.whackywheels.controllers;

import pt.um.aasic.whackywheels.dtos.NotificationCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.NotificationResponseDTO;
import pt.um.aasic.whackywheels.services.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    //Aqui a role ainda não sei bem quem vai criar notifications
    public ResponseEntity<NotificationResponseDTO> createNotification(@Valid @RequestBody NotificationCreateRequestDTO request) {
        try {
            NotificationResponseDTO newNotification = notificationService.createNotification(request);
            return new ResponseEntity<>(newNotification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationResponseDTO> markNotificationAsRead(@PathVariable Long id) {
        try {
            NotificationResponseDTO updatedNotification = notificationService.markNotificationAsRead(id);
            return ResponseEntity.ok(updatedNotification);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
