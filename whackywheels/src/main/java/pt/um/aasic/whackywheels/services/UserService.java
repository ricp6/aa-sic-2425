package pt.um.aasic.whackywheels.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.um.aasic.whackywheels.dtos.UserProfileDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.repositories.UserRepository;
import pt.um.aasic.whackywheels.repositories.TrackRepository;
import pt.um.aasic.whackywheels.dtos.UserResponseDTO;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, TrackRepository trackRepository,  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.trackRepository = trackRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void addFavoriteTrack(Long userId, Long trackId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        user.getFavoriteTracks().add(track);
        userRepository.save(user);
    }

    @Transactional
    public void removeFavoriteTrack(Long userId, Long trackId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Track track = trackRepository.findById(trackId) // Fetch track to ensure it exists
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        boolean removed = user.getFavoriteTracks().remove(track);
        if (!removed) {
            // Optional: Handle case where the track wasn't a favorite to begin with
            System.out.println("Track " + trackId + " was not in user " + userId + "'s favorites.");
        }
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Obtener solo los nombres de los tracks favoritos
        List<String> favoriteTrackNames = user.getFavoriteTracks()
                .stream()
                .map(Track::getName)
                .collect(Collectors.toList());

        // Determinar rol
        String role = (user.getUserType() != null) ? user.getUserType() : "USER";

        // Crear y retornar el DTO
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

    @Transactional
    public void changeUserPassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void updateUserProfile(Long userId, String newName, String newEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (newName != null && !newName.trim().isEmpty()) {
            user.setName(newName.trim());
        }
        if (newEmail != null && !newEmail.trim().isEmpty()) {
            user.setEmail(newEmail.trim());
        }

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> searchUsersByNameOrEmail(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
                .map(this::mapUserToUserResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToUserResponseDTO)
                .collect(Collectors.toList());
    }

    private UserResponseDTO mapUserToUserResponseDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getUserType()); 
    }
}   
