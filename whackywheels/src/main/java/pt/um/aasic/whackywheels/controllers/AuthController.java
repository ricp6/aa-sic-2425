package pt.um.aasic.whackywheels.controllers;
import pt.um.aasic.whackywheels.dtos.LoginRequestDTO;
import pt.um.aasic.whackywheels.dtos.RegisterRequestDTO;
import pt.um.aasic.whackywheels.dtos.UserResponseDTO;
import pt.um.aasic.whackywheels.entities.Owner;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.AuthService;
import pt.um.aasic.whackywheels.services.NotificationService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            User newUser = authService.registerNewUser(request);
            String userTypeString = "USER";
            UserResponseDTO userResponse = new UserResponseDTO(
                    newUser.getId(),
                    newUser.getEmail(),
                    newUser.getName(),
                    userTypeString,
                    0L
            );
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO request) {
        try {
            User authenticatedUser = authService.authenticateUser(request);

            String userTypeString;
            if (authenticatedUser instanceof Owner) {
                userTypeString = "OWNER";
            } else {
                userTypeString = "USER";
            }
            Long unreadNotificationCount = NotificationService.getUnreadNotificationCount(authenticatedUser.getId());
            UserResponseDTO userResponse = new UserResponseDTO(
                    authenticatedUser.getId(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getName(),
                    userTypeString,
                    unreadNotificationCount
            );
            //Talvez incluir token JWT aqui?
            return new ResponseEntity<>(userResponse, HttpStatus.OK);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}