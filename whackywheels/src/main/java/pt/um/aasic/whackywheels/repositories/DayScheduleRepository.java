package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.DaySchedule;
import pt.um.aasic.whackywheels.entities.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
@Repository
public interface DayScheduleRepository extends JpaRepository<DaySchedule, Long> {
    Optional<DaySchedule> findByTrackAndDay(Track track, DayOfWeek day);
    List<DaySchedule> findByTrack(Track track);
}