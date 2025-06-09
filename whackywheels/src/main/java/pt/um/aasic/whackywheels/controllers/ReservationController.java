package pt.um.aasic.whackywheels.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pt.um.aasic.whackywheels.dtos.ReservationCreateRequestDTO;
import pt.um.aasic.whackywheels.entities.Reservation;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.services.ReservationService;
import pt.um.aasic.whackywheels.dtos.ReservationResponseDTO;

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
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationCreateRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User)) {
            return new ResponseEntity<>("Authenticated principal is not a valid User.", HttpStatus.FORBIDDEN);
        }
        User currentUser = (User) authentication.getPrincipal();
        Long currentUserId = currentUser.getId();

        try {
            ReservationResponseDTO newReservationResponse = reservationService.createReservation(request, currentUserId); // <<-- Altera o tipo de retorno
            return new ResponseEntity<>(newReservationResponse, HttpStatus.CREATED); // <<-- Devolve o DTO de resposta
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getReservation(@PathVariable Long reservationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User)) {
            return new ResponseEntity<>("Authenticated principal is not a valid User.", HttpStatus.FORBIDDEN);
        }
        User currentUser = (User) authentication.getPrincipal();
        Long currentUserId = currentUser.getId();

        try {
            ReservationResponseDTO reservationResponse = reservationService.getReservationById(reservationId, currentUserId);
            if (reservationResponse == null) {
                return new ResponseEntity<>("Reservation not found or you do not have access to it.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(reservationResponse, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getUserReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User)) {
            return new ResponseEntity<>("Authenticated principal is not a valid User.", HttpStatus.FORBIDDEN);
        }
        User currentUser = (User) authentication.getPrincipal();
        Long currentUserId = currentUser.getId();

        try {
            List<ReservationResponseDTO> reservations = reservationService.getReservationsByUserId(currentUserId);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to retrieve reservations: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
