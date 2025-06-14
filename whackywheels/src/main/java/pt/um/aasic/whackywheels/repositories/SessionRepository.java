package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.ReservationStatus;
import pt.um.aasic.whackywheels.entities.Session;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT s FROM Session s JOIN s.reservation r " +
            "WHERE r.track.id = :trackId " +
            "AND r.date = :targetDate " +
            "AND (r.status = :pendingStatus OR r.status = :acceptedStatus)")
    List<Session> findOccupiedSessionsForTrackAndDate(
            @Param("trackId") Long trackId,
            @Param("targetDate") LocalDate targetDate,
            @Param("pendingStatus") ReservationStatus pendingStatus,
            @Param("acceptedStatus") ReservationStatus acceptedStatus);

    @Query("SELECT s FROM Session s JOIN s.reservation r WHERE r.track.id = :trackId AND r.date = :date AND r.status IN :statuses AND r.id != :excludedReservationId")
    List<Session> findOccupiedSessionsForTrackAndDateExcludingReservation(
            @Param("trackId") Long trackId,
            @Param("date") LocalDate date,
            @Param("statuses") List<ReservationStatus> statuses,
            @Param("excludedReservationId") Long excludedReservationId
    );

    @Query("SELECT s FROM Session s " +
            "LEFT JOIN FETCH s.reservation r " +
            "LEFT JOIN FETCH r.track " +
            "LEFT JOIN FETCH r.participants p " +
            "LEFT JOIN FETCH p.user " +
            "LEFT JOIN FETCH p.kart " +
            "LEFT JOIN FETCH s.classifications c " +
            "LEFT JOIN FETCH c.participant cp " +
            "LEFT JOIN FETCH cp.user " +
            "LEFT JOIN FETCH s.timePerLaps tpl " +
            "LEFT JOIN FETCH tpl.participant tplp " +
            "LEFT JOIN FETCH tplp.user " +
            "WHERE s.id = :sessionId")
    Optional<Session> findByIdWithAllDetails(@Param("sessionId") Long sessionId);

    @Query("SELECT s FROM Session s " +
            "JOIN FETCH s.reservation r " +
            "LEFT JOIN FETCH r.track " + // Fetch the track
            "LEFT JOIN FETCH r.participants p " + // Fetch participants
            "LEFT JOIN FETCH p.user " + // Fetch participant users
            "WHERE p.user.id = :userId AND r.status = :status")
    List<Session> findSessionsByUserId(@Param("userId") Long userId, @Param("status") ReservationStatus status);

    @Query("SELECT s FROM Session s JOIN FETCH s.reservation r LEFT JOIN FETCH r.sessions " +
            "WHERE r.date = :date " +
            "AND s.bookedEndTime <= :currentTime " +
            "AND s.actualStartTime IS NOT NULL " +
            "AND s.actualEndTime IS NULL")
    List<Session> findSessionsToEnd(@Param("date") LocalDate date, @Param("currentTime") LocalTime currentTime);

    @Query("SELECT s FROM Session s " +
            "LEFT JOIN FETCH s.reservation r " +
            "LEFT JOIN FETCH r.sessions rs " +
            "LEFT JOIN FETCH r.participants rp " +
            "LEFT JOIN FETCH rp.timePerLaps rptpl " +
            "LEFT JOIN FETCH s.classifications sc " +
            "WHERE s.id = :sessionId")
    Optional<Session> findByIdForEndingSession(@Param("sessionId") Long sessionId);


}