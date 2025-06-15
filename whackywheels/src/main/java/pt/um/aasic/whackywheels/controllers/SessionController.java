package pt.um.aasic.whackywheels.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.dtos.session.SessionsDetailsResponseDTO;
import pt.um.aasic.whackywheels.dtos.session.SessionResponseDTO;
import pt.um.aasic.whackywheels.services.SessionService;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getSessionsByUser(@AuthenticationPrincipal User authenticatedUser) {
        Long userId = authenticatedUser.getId();
        try {
            List<SessionResponseDTO> sessions = sessionService.getSessionsByUser(userId);
            log.info("Fetched sessions for user {}: {}", userId, sessions);
            return ResponseEntity.ok(sessions);
        } catch (IllegalArgumentException e) {
            log.error("Error fetching sessions: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error fetching sessions: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{sessionId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER')")
    public ResponseEntity<?> getSessionDetails(@PathVariable Long sessionId, @AuthenticationPrincipal User authenticatedUser) {
        try {
            Long userId = authenticatedUser.getId();
            SessionsDetailsResponseDTO sessionDetails = sessionService.getSessionDetailsBySessionId(sessionId, userId);
            if (sessionDetails == null) {
                return new ResponseEntity<>("Session not found or you do not have access to it.", HttpStatus.NOT_FOUND);
            }
            log.info("Fetched session details for session {}: {}", sessionId, sessionDetails);
            return ResponseEntity.ok(sessionDetails);
        } catch (IllegalArgumentException e) {
            log.error("Error fetching session details: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error fetching session details: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{sessionId}/start")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> startSession(@PathVariable Long sessionId, @AuthenticationPrincipal User authenticatedUser) {
        try {
            sessionService.startSession(sessionId);
            log.info("Session {} started successfully by user {}", sessionId, authenticatedUser.getId());
            return ResponseEntity.ok("Session " + sessionId + " started successfully.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Error starting session: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error starting session: {}", e.getMessage());
            return new ResponseEntity<>("Error starting session: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{sessionId}/end")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> endSession(@PathVariable Long sessionId, @AuthenticationPrincipal User authenticatedUser) {
        try {
            sessionService.endSession(sessionId);
            log.info("Session {} ended successfully by user {}", sessionId, authenticatedUser.getId());
            return ResponseEntity.ok("Session " + sessionId + " ended and classifications calculated successfully.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Error ending session: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error ending session: {}", e.getMessage());
            return new ResponseEntity<>("Error ending session: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{sessionId}/{participantId}/{lapTime}")
    public ResponseEntity<?> addLapTime(@PathVariable Long sessionId, @PathVariable Long participantId, @PathVariable Double lapTime, @AuthenticationPrincipal User authenticatedUser) {
        try {
            sessionService.recordLapTime(sessionId, participantId, lapTime);
            log.info("Lap time {} added for participant {} in session {}", lapTime, participantId, sessionId);
            return ResponseEntity.ok("Lap time added successfully.");
        } catch (IllegalArgumentException e) {
            log.error("Error adding lap time: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error adding lap time: {}", e.getMessage());
            return new ResponseEntity<>("Error adding lap time: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
