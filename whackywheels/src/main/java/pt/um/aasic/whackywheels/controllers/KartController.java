package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import pt.um.aasic.whackywheels.dtos.kart.KartRequestDTO;
import pt.um.aasic.whackywheels.dtos.kart.KartResponseDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.KartService;

import java.util.List;

@RestController
@RequestMapping("/api/karts")
public class KartController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final KartService kartService;

    public KartController(KartService kartService) {
        this.kartService = kartService;
    }

    @GetMapping("/available/{trackId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getAvailableKarts(@PathVariable @NotNull Long trackId, @AuthenticationPrincipal User authenticatedUser) {
        try {
            List<KartResponseDTO> availableKarts = kartService.getAvailableKarts(trackId);
            log.info("Available karts for track {}: {}", trackId, availableKarts);
            return ResponseEntity.ok(availableKarts);
        } catch (IllegalArgumentException e) {
            log.error("Error fetching available karts: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error fetching available karts: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createKart(@RequestBody @NotNull KartRequestDTO kartDTO, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            KartResponseDTO createdKart = kartService.createKart(kartDTO, ownerId);
            log.info("Kart created successfully: {}", createdKart);
            return new ResponseEntity<>(createdKart, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            log.error("Error creating kart: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error creating kart: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("update/{kartId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> updateKart(@PathVariable @NotNull Long kartId, @RequestBody @NotNull KartRequestDTO kartDTO, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long ownerId = authenticatedUser.getId();
            KartResponseDTO updatedKart = kartService.updateKart(kartId, kartDTO, ownerId);
            log.info("Kart updated successfully: {}", updatedKart);
            return ResponseEntity.ok(updatedKart);
        } catch (IllegalArgumentException e) {
            log.error("Error updating kart: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating kart: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}