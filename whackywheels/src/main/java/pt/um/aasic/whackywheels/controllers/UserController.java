package pt.um.aasic.whackywheels.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.dtos.UserProfileDTO;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public UserProfileDTO getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        List<String> favoriteTrackNames = user.getFavoriteTracks()
                .stream()
                .map(Track::getName)
                .collect(Collectors.toList());

        String role = user.getAuthorities()
                .stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("Usuario");

        return new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                role,
                user.getTotalSessions(),
                user.getVictories(),
                user.getTracksVisited(),
                favoriteTrackNames
        );
    }
}



