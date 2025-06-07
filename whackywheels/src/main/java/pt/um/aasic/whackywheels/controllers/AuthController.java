package pt.um.aasic.whackywheels.controllers;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import pt.um.aasic.whackywheels.dtos.LoginRequestDTO;
import pt.um.aasic.whackywheels.dtos.LoginResponseDTO; // Importe o novo DTO
import pt.um.aasic.whackywheels.dtos.RegisterRequestDTO;
import pt.um.aasic.whackywheels.dtos.UserResponseDTO;
import pt.um.aasic.whackywheels.entities.Owner;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.security.JwtService; // Importe o JwtService
import pt.um.aasic.whackywheels.services.AuthService;
import pt.um.aasic.whackywheels.services.NotificationService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
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
                    0L,
                    Collections.emptyList()
            );
            return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User authenticatedUser = (User) authentication.getPrincipal();

            String userTypeString;
            if (authenticatedUser instanceof Owner) {
                userTypeString = "OWNER";
            } else {
                userTypeString = "USER";
            }
            Long unreadNotificationCount = NotificationService.getUnreadNotificationCount(authenticatedUser.getId());

            List<Long> favoriteTrackIds = authenticatedUser.getFavoriteTracks().stream()
                    .map(Track::getId)
                    .toList();

            String jwtToken = jwtService.generateToken(authenticatedUser);

            LoginResponseDTO  loginResponse  = new LoginResponseDTO(
                    authenticatedUser.getId(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getName(),
                    userTypeString,
                    unreadNotificationCount,
                    favoriteTrackIds,
                    jwtToken
            );
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}