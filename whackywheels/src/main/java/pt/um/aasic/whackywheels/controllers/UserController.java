package pt.um.aasic.whackywheels.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.UserService;

@RestController
@RequestMapping("/api/users") // A logical base path for user-related operations
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/favorites/add/{trackId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<String> addFavoriteTrack(@AuthenticationPrincipal User authenticatedUser, @PathVariable Long trackId) {
        try {
            if (authenticatedUser == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

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
            if (authenticatedUser == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            userService.removeFavoriteTrack(authenticatedUser.getId(), trackId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error removing track from favorites.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}