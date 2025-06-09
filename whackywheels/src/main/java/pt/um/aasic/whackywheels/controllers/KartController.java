package pt.um.aasic.whackywheels.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.dtos.KartResponseDTO;
import pt.um.aasic.whackywheels.services.KartService;
import pt.um.aasic.whackywheels.dtos.AvailableKartsRequestDTO;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/karts")
public class KartController {

    private final KartService kartService;

    public KartController(KartService kartService) {
        this.kartService = kartService;
    }
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getAvailableKarts(@Valid @ModelAttribute AvailableKartsRequestDTO requestDTO) {
        try {
            List<KartResponseDTO> availableKarts = kartService.getAvailableKartsForTrackAndSession(
                    requestDTO.getTrackId(),
                    requestDTO.getSessionStart(),
                    requestDTO.getSessionEnd());
            return ResponseEntity.ok(availableKarts);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}