package pt.um.aasic.whackywheels.controllers;

import pt.um.aasic.whackywheels.dtos.*;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.TrackService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {

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
            return new ResponseEntity<>(newTrack, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create track: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<TrackResponseDTO>> getAllTracks() {
        try{
            List<TrackResponseDTO> tracks = trackService.findAllTracks();
            return new ResponseEntity<>(tracks, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/records")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<List<TrackRecordResponseDTO>> getAllTracksRecords(@AuthenticationPrincipal User authenticatedUser) {
        try {
            if (authenticatedUser == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            Long userId = authenticatedUser.getId();

            List<TrackRecordResponseDTO> records = trackService.findAllTracksRecords(userId);
            return new ResponseEntity<>(records, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrack(@PathVariable Long id) {
        try{
            TrackDetailsResponseDTO track = trackService.findTrack(id);
            if (track == null) {
                return new ResponseEntity<>("Track not found.",HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(track, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
