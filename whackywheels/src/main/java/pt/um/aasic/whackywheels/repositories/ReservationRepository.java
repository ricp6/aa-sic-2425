package pt.um.aasic.whackywheels.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.um.aasic.whackywheels.entities.Reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByParticipants_UserId(Long userId);

    @Query("SELECT r FROM Reservation r " +
            "LEFT JOIN FETCH r.track " + // Fetch track details
            "LEFT JOIN FETCH r.sessions s " + // Fetch sessions
            "LEFT JOIN FETCH s.classifications c " + // Fetch classifications for each session
            "LEFT JOIN FETCH r.participants p " + // Fetch participants for the reservation
            "LEFT JOIN FETCH p.user " + // Fetch user details for each participant
            "LEFT JOIN FETCH p.kart " + // Fetch kart details for each participant
            "LEFT JOIN FETCH s.timePerLaps tpl " + // Fetch time per laps for each session
            "WHERE r.id = :reservationId")
    Optional<Reservation> findByIdWithDetails(@Param("reservationId") Long reservationId);
}
