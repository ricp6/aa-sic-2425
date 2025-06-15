package pt.um.aasic.whackywheels.controllers;

import pt.um.aasic.whackywheels.dtos.track.TrackCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.track.TrackDetailsResponseDTO;
import pt.um.aasic.whackywheels.dtos.track.TrackFilterResponseDTO;
import pt.um.aasic.whackywheels.dtos.track.TrackRecordResponseDTO;
import pt.um.aasic.whackywheels.dtos.track.TrackResponseDTO;
import pt.um.aasic.whackywheels.dtos.track.TrackUpdateRequestDTO;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.TrackService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final TrackService trackService;

    public TrackController(TrackService trackService) {
        this.trackService = trackService;
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createTrack(@Valid @RequestBody TrackCreateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            Track newTrack = trackService.createTrack(request, ownerId);
            log.info("Track created successfully: {}", newTrack);
            return new ResponseEntity<>(newTrack, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            log.error("Error creating track: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error creating track: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create track: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<TrackResponseDTO>> getAllTracks() {
        try{
            List<TrackResponseDTO> tracks = trackService.findAllTracks();
            log.info("Fetched all tracks: {}", tracks);
            return new ResponseEntity<>(tracks, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching tracks: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/records")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<List<TrackRecordResponseDTO>> getAllTracksRecords(@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();

            List<TrackRecordResponseDTO> records = trackService.findAllTracksRecords(userId);
            log.info("Fetched all track records for user {}: {}", userId, records);
            return new ResponseEntity<>(records, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching track records: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrack(@PathVariable Long id) {
        try{
            TrackDetailsResponseDTO track = trackService.findTrack(id);
            log.info("Fetched track details for track {}: {}", id, track);
            return new ResponseEntity<>(track, HttpStatus.OK);
        }catch (IllegalArgumentException e) {
            log.error("Error fetching track: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            log.error("Error fetching track: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //OWNER
    @GetMapping("/owned")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<TrackResponseDTO>> getOwnedTracks(@AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            List<TrackResponseDTO> ownedTracks = trackService.findOwnedTracks(ownerId);
            log.info("Fetched owned tracks for owner {}: {}", ownerId, ownedTracks);
            return new ResponseEntity<>(ownedTracks, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching owned tracks: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/changeAvailability/{trackId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> setTrackAvailability(@PathVariable Long trackId, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            trackService.setTrackAvailability(trackId, ownerId);
            log.info("Track availability updated successfully for track {} by owner {}", trackId, ownerId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error updating track availability: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating track availability: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update track availability: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{trackId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> updateTrack(@PathVariable Long trackId, @Valid @RequestBody TrackUpdateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            trackService.updateTrack(trackId, request, ownerId);
            log.info("Track updated successfully: {}", trackId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error updating track: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating track: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update track: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TrackFilterResponseDTO>> getTrackDetaislForFilters() {
        try {
            List<TrackFilterResponseDTO> filteredTracks = trackService.getTrackDetaislForFilters();
            log.info("Fetched track details for filters: {}", filteredTracks);
            return new ResponseEntity<>(filteredTracks, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching track details for filters: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
