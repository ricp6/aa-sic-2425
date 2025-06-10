package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import pt.um.aasic.whackywheels.dtos.OccupiedSlotResponseDTO;
import pt.um.aasic.whackywheels.dtos.ReservationCreateRequestDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.ReservationService;
import pt.um.aasic.whackywheels.dtos.ReservationResponseDTO;
import pt.um.aasic.whackywheels.dtos.OccupiedSlotRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationCreateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationResponseDTO newReservationResponse = reservationService.createReservation(request, userId);
            return new ResponseEntity<>(newReservationResponse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getReservation(@PathVariable Long reservationId, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationResponseDTO reservationResponse = reservationService.getReservationById(reservationId, userId);
            if (reservationResponse == null) {
                return new ResponseEntity<>("Reservation not found or you do not have access to it.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(reservationResponse, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getUserReservations(@AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            List<ReservationResponseDTO> reservations = reservationService.getReservationsByUserId(userId);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/cancel/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> cancelReservation(@PathVariable Long reservationId, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            reservationService.cancelReservation(reservationId, userId);
            return new ResponseEntity<>("Reservation cancelled successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to cancel reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> updateReservation(@PathVariable Long reservationId, @Valid @RequestBody ReservationCreateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationResponseDTO updatedReservationResponse = reservationService.updateReservation(reservationId, request, userId);
            return new ResponseEntity<>(updatedReservationResponse, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/occupied-slots")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getOccupiedSlots(@Valid @RequestBody OccupiedSlotRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        try {
            List<OccupiedSlotResponseDTO> occupiedSlots = reservationService.getOccupiedSlotsForTrackAndDate(request.getTrackId(), request.getDate());
            return ResponseEntity.ok(occupiedSlots);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
