package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.dtos.KartResponseDTO;
import pt.um.aasic.whackywheels.services.KartService;

import java.util.List;

@RestController
@RequestMapping("/api/karts")
public class KartController {

    private final KartService kartService;

    public KartController(KartService kartService) {
        this.kartService = kartService;
    }

    @GetMapping("/available/{trackId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getAvailableKarts(@PathVariable @NotNull Long trackId) {
        try {
            List<KartResponseDTO> availableKarts = kartService.getAvailableKarts(trackId);
            return ResponseEntity.ok(availableKarts);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}