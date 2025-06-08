package pt.um.aasic.whackywheels.controllers;

import pt.um.aasic.whackywheels.dtos.SimpleTrackResponseDTO;
import pt.um.aasic.whackywheels.dtos.TrackCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.TrackResponseDTO;
import pt.um.aasic.whackywheels.entities.Owner;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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

    @GetMapping("/all") // <<-- Novo endpoint
    public ResponseEntity<List<SimpleTrackResponseDTO>> getAllTracks() {
        List<SimpleTrackResponseDTO> tracks = trackService.findAllTracks();
        return new ResponseEntity<>(tracks, HttpStatus.OK);
    }

    @GetMapping("/{id}") // <<-- Novo endpoint
    public ResponseEntity<TrackResponseDTO> getTrack(@PathVariable Long id) {
        TrackResponseDTO track = trackService.findTrack(id);
        if (track == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(track, HttpStatus.OK);
    }
}
