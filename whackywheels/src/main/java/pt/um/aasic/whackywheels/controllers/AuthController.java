package pt.um.aasic.whackywheels.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import pt.um.aasic.whackywheels.dtos.LoginRequestDTO;
import pt.um.aasic.whackywheels.dtos.LoginResponseDTO;
import pt.um.aasic.whackywheels.dtos.RegisterRequestDTO;
import pt.um.aasic.whackywheels.dtos.TokenResponseDTO;
import pt.um.aasic.whackywheels.entities.Owner;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.security.JwtService;
import pt.um.aasic.whackywheels.services.AuthService;
import pt.um.aasic.whackywheels.services.NotificationService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;
    private final UserDetailsService userDetailsService;


    public AuthController(AuthService authService, JwtService jwtService, AuthenticationManager authenticationManager, NotificationService notificationService, UserDetailsService userDetailsService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.notificationService = notificationService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            authService.registerNewUser(request);

            return new ResponseEntity<>(HttpStatus.CREATED);
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
            Long unreadNotificationCount = notificationService.getUnreadNotificationCount(authenticatedUser.getId());

            List<Long> favoriteTrackIds = authenticatedUser.getFavoriteTracks().stream()
                    .map(Track::getId)
                    .toList();

            String acessToken = jwtService.generateAccessToken(authenticatedUser);
            String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

            LoginResponseDTO  loginResponse  = new LoginResponseDTO(
                    authenticatedUser.getId(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getName(),
                    userTypeString,
                    unreadNotificationCount,
                    favoriteTrackIds,
                    acessToken,
                    refreshToken
            );
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        try {
            final String authHeader = request.getHeader("Authorization");
            final String refreshToken;

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Refresh token is missing or malformed in Authorization header.");
            }

            refreshToken = authHeader.substring(7);
            if (jwtService.isTokenValid(refreshToken, userDetailsService.loadUserByUsername(jwtService.extractUsername(refreshToken)))) {
                String userEmail = jwtService.extractUsername(refreshToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                String newAccessToken = jwtService.generateAccessToken(userDetails);

                // Opcional: Gerar um novo refresh token e invalidar o antigo (para rotação de refresh tokens)
                // String newRefreshToken = jwtService.generateRefreshToken(userDetails);
                // invalidateOldRefreshToken(refreshToken); // Implementar lógica para invalidar refresh token

                return new ResponseEntity<>(new TokenResponseDTO(newAccessToken), HttpStatus.OK);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error refreshing token: " + e.getMessage());
        }
    }
}