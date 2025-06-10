package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Participant;
import pt.um.aasic.whackywheels.entities.ReservationStatus;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    @Query("SELECT p FROM Participant p JOIN p.reservation r JOIN r.sessions s " +
            "WHERE r.track.id = :trackId " +
            "AND r.date BETWEEN :startOfDay AND :endOfDay " +
            "AND (" +
            "   (s.startTime < :sessionEndTime AND s.endTime > :sessionStartTime) " +
            ") " +
            "AND (r.status = :pendingStatus OR r.status = :confirmedStatus) " +
            "AND p.kart IS NOT NULL")
    List<Participant> findKartsOccupiedBySessionOverlap(
            @Param("trackId") Long trackId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("sessionStartTime") LocalTime sessionStartTime,
            @Param("sessionEndTime") LocalTime sessionEndTime,
            @Param("pendingStatus") ReservationStatus pendingStatus,
            @Param("confirmedStatus") ReservationStatus confirmedStatus);
}