package pt.um.aasic.whackywheels.services;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.repositories.UserRepository;
import pt.um.aasic.whackywheels.repositories.TrackRepository;
import pt.um.aasic.whackywheels.dtos.UserResponseDTO;
import java.util.List;

@Service
public class UserService { // Or create a new service like UserFavoriteTrackService

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;

    public UserService(UserRepository userRepository, TrackRepository trackRepository) {
        this.userRepository = userRepository;
        this.trackRepository = trackRepository;
    }

    @Transactional // Ensures the entire operation is a single transaction
    public void addFavoriteTrack(Long userId, Long trackId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        user.getFavoriteTracks().add(track); // set prevents duplicates automatically
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
    public List<UserResponseDTO> searchUsersByNameOrEmail(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
                .map(this::mapUserToUserResponseDTO) // Assumindo que você tem um método de mapeamento
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