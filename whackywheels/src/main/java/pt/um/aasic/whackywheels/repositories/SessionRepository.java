package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.ReservationStatus;
import pt.um.aasic.whackywheels.entities.Session;
import pt.um.aasic.whackywheels.entities.Track;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT s FROM Session s JOIN s.reservation r " +
           "WHERE r.track.id = :trackId " +
           "AND r.date BETWEEN :startOfDay AND :endOfDay " +
           "AND (r.status = :pendingStatus OR r.status = :confirmedStatus)")
    List<Session> findOccupiedSessionsForTrackAndDate(
            @Param("trackId") Long trackId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("pendingStatus") ReservationStatus pendingStatus, // Passa o enum ReservationStatus.PENDING
            @Param("confirmedStatus") ReservationStatus confirmedStatus);

    List<Session> findByReservation_TrackAndReservation_DateBetween(Track track, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
