package pt.um.aasic.whackywheels.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.dtos.PasswordChangeRequest;
import pt.um.aasic.whackywheels.dtos.UserProfileDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.UserService;
import pt.um.aasic.whackywheels.dtos.UserResponseDTO;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/favorites/add/{trackId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<String> addFavoriteTrack(@AuthenticationPrincipal User authenticatedUser, @PathVariable Long trackId) {
        try {
            userService.addFavoriteTrack(authenticatedUser.getId(), trackId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error adding track to favorites.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/favorites/remove/{trackId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<String> removeFavoriteTrack(@AuthenticationPrincipal User authenticatedUser, @PathVariable Long trackId) {
        try {
            userService.removeFavoriteTrack(authenticatedUser.getId(), trackId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error removing track from favorites.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User authenticatedUser) {
        try {
            if (authenticatedUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized.");
            }

            // Usar el servicio que construye el DTO limpio
            UserProfileDTO dto = userService.getUserProfile(authenticatedUser.getId());
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user profile: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request, @AuthenticationPrincipal User authenticatedUser) {
        try {
            if (authenticatedUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }

            userService.changeUserPassword(authenticatedUser.getId(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Internal error"));
        }
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user, @RequestBody Map<String, String> updates) {
        try {
            String newName = updates.get("name");
            String newEmail = updates.get("email");

            userService.updateUserProfile(user.getId(), newName, newEmail);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<List<UserResponseDTO>> searchUsers(@RequestParam(required = false) String query) {
        List<UserResponseDTO> users;
        if (query != null && !query.trim().isEmpty()) {
            users = userService.searchUsersByNameOrEmail(query);
        } else {
            users = userService.getAllUsers();
        }
        return ResponseEntity.ok(users);
    }
}