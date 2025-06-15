package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import pt.um.aasic.whackywheels.dtos.NotificationMessageDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationDetailsResponseDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationResponseDTO;
import pt.um.aasic.whackywheels.dtos.reservation.ReservationUpdateRequestDTO;
import pt.um.aasic.whackywheels.dtos.track.SlotResponseDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.ReservationService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationCreateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationDetailsResponseDTO newReservationResponse = reservationService.createReservation(request, userId);
            log.info("Reservation created successfully for user {}: {}", userId, newReservationResponse);
            return new ResponseEntity<>(newReservationResponse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            log.error("Error creating reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error creating reservation: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getReservation(@PathVariable Long reservationId, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationDetailsResponseDTO reservationResponse = reservationService.getReservationById(reservationId, userId);
            log.info("Retrieved reservation for user {}: {}", userId, reservationResponse);
            return new ResponseEntity<>(reservationResponse, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error retrieving reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error retrieving reservation: {}", e.getMessage());
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
            log.info("Retrieved reservations for user {}: {}", userId, reservations);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error retrieving reservations: {}", e.getMessage());
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
            log.info("Reservation {} cancelled successfully for user {}", reservationId, userId);
            return new ResponseEntity<>("Reservation cancelled successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error cancelling reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error cancelling reservation: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to cancel reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> updateReservation(@PathVariable Long reservationId, @Valid @RequestBody ReservationUpdateRequestDTO request, @AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();

        try {
            ReservationDetailsResponseDTO updatedReservationResponse = reservationService.updateReservation(reservationId, request, userId);
            log.info("Reservation {} updated successfully for user {}", reservationId, userId);
            return new ResponseEntity<>(updatedReservationResponse, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error updating reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error updating reservation: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/slots/{trackId}/{date}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getSlots(@PathVariable Long trackId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @AuthenticationPrincipal User authenticatedUser) {
        try {
            List<SlotResponseDTO> slots = reservationService.getSlotsForTrackAndDate(trackId, date);
            log.info("Retrieved slots for track {} on date {}: {}", trackId, date, slots);
            return ResponseEntity.ok(slots);
        } catch (IllegalArgumentException e) {
            log.error("Error retrieving slots: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //OWNER
    @GetMapping("/track/active/{trackId}")
    @PreAuthorize("hasAnyRole('OWNER')")
    public ResponseEntity<?> getAcceptedAndPendingReservationsByTrack(@PathVariable Long trackId, @AuthenticationPrincipal User authenticatedUser) {
        Long ownerId = authenticatedUser.getId();

        try {
            List<ReservationResponseDTO> reservations = reservationService.getAcceptedAndPendingReservationsByTrackId(trackId, ownerId);
            log.info("Retrieved active reservations for track {}: {}", trackId, reservations);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error retrieving active reservations: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error retrieving active reservations: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/track/concluded/{trackId}")
    @PreAuthorize("hasAnyRole('OWNER')")
    public ResponseEntity<?> getConcludedReservationsByTrack(@PathVariable Long trackId, @AuthenticationPrincipal User authenticatedUser) {
        Long ownerId = authenticatedUser.getId();

        try {
            List<ReservationResponseDTO> reservations = reservationService.getConcludedReservationsByTrackId(trackId, ownerId);
            log.info("Retrieved concluded reservations for track {}: {}", trackId, reservations);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error retrieving concluded reservations: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error retrieving concluded reservations: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/accept/{reservationId}")
    @PreAuthorize("hasAnyRole('OWNER')")
    public ResponseEntity<?> acceptReservation(@PathVariable Long reservationId, @RequestBody(required = false) NotificationMessageDTO request , @AuthenticationPrincipal User authenticatedUser) {
        Long ownerId = authenticatedUser.getId();

        try {
            reservationService.acceptReservation(reservationId, ownerId, request);
            log.info("Reservation {} accepted successfully by owner {}", reservationId, ownerId);
            return new ResponseEntity<>("Reservation accepted successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error accepting reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error accepting reservation: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to accept reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/reject/{reservationId}")
    @PreAuthorize("hasAnyRole('OWNER')")
    public ResponseEntity<?> rejectReservation(@PathVariable Long reservationId, @RequestBody(required = false) NotificationMessageDTO request, @AuthenticationPrincipal User authenticatedUser) {
        Long ownerId = authenticatedUser.getId();

        try {
            reservationService.rejectReservation(reservationId, ownerId, request);
            log.info("Reservation {} rejected successfully by owner {}", reservationId, ownerId);
            return new ResponseEntity<>("Reservation rejected successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.error("Error rejecting reservation: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error rejecting reservation: {}", e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to reject reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
