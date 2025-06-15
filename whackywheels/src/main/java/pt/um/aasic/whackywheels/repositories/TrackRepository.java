package pt.um.aasic.whackywheels.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.um.aasic.whackywheels.entities.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
    /**
     * Finds the minimum lap time for each track across all participants.
     * Joins Track -> Reservation -> Session -> TimePerLap to get all lap times,
     * then groups by track to find the minimum for each.
     *
     * @return A list of Object arrays, where each array contains [trackId, minLapTime].
     */
    @Query("SELECT t.id, MIN(tpl.lapTime) " +
            "FROM Track t " +
            "JOIN t.reservations r " +
            "JOIN r.sessions s " +
            "JOIN s.timePerLaps tpl " +
            "WHERE tpl.lapTime IS NOT NULL " + // Only consider valid lap times
            "GROUP BY t.id")
    List<Object[]> findOverallMinLapTimesPerTrack();

    /**
     * Finds the minimum lap time for a specific user on each track they participated in.
     * Joins Track -> Reservation -> Session -> TimePerLap, filters by the given userId,
     * and finds the minimum lap time for that user on each track.
     *
     * @param userId The ID of the user for whom to find personal bests.
     * @return A list of Object arrays, where each array contains [trackId, personalMinLapTime].
     */
    @Query("SELECT t.id, MIN(tpl.lapTime) " +
            "FROM Track t " +
            "JOIN t.reservations r " +
            "JOIN r.sessions s " +
            "JOIN s.timePerLaps tpl " +
            "WHERE tpl.participant.user.id = :userId " + // Filter by specific user
            "AND tpl.lapTime IS NOT NULL " + // Only consider valid lap times
            "GROUP BY t.id")
    List<Object[]> findPersonalMinLapTimesForUser(@Param("userId") Long userId);

    // Track Rankings query (as corrected previously)
    @Query(value = "SELECT " +
            "p.user.name, " +
            "r.date, " +
            "k.kartNumber, " +
            "p.user.profilePicture, "+
            "MIN(tpl.lapTime) " +
            "FROM Track t " +
            "JOIN t.reservations r " +
            "JOIN r.participants p " +
            "JOIN p.kart k " +
            "JOIN p.timePerLaps tpl " +
            "WHERE t.id = :trackId " +
            "AND tpl.lapTime IS NOT NULL " +
            "GROUP BY p.id, p.user.name, p.user.profilePicture, r.date, k.kartNumber " +
            "ORDER BY MIN(tpl.lapTime) ASC " +
            "LIMIT 20")
    List<Object[]> findTopRankingsByTrackId(@Param("trackId") Long trackId);

    /**
     * Optimized query to fetch a Track along with its associated DaySchedules and Karts
     * in a single database query. This prevents N+1 select problems when accessing
     * these collections from the fetched Track entity.
     *
     * @param id The ID of the Track to retrieve.
     * @return An Optional containing the Track if found, with schedules and karts eagerly fetched.
     */
    @Query("SELECT t FROM Track t LEFT JOIN FETCH t.daySchedules LEFT JOIN FETCH t.karts WHERE t.id = :id")
    Optional<Track> findByIdWithDaySchedulesAndKarts(@Param("id") Long id);
}
