package pt.um.aasic.whackywheels.controllers;

import pt.um.aasic.whackywheels.dtos.TrackCreateRequestDTO;
import pt.um.aasic.whackywheels.entities.Owner;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {

    private final TrackService trackService;

    public TrackController(TrackService trackService) {
        this.trackService = trackService;
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createTrack(@Valid @RequestBody TrackCreateRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User)) {
            return new ResponseEntity<>("Authenticated principal is not a User entity.", HttpStatus.FORBIDDEN);
        }

        User authenticatedUser = (User) authentication.getPrincipal();

        if (!(authenticatedUser instanceof Owner)) {
            return new ResponseEntity<>("Only Owners can create tracks.", HttpStatus.FORBIDDEN); // 403 Forbidden
        }

        Long ownerId = authenticatedUser.getId();

        try {
            Track newTrack = trackService.createTrack(request, ownerId);
            return new ResponseEntity<>(newTrack, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create track: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
