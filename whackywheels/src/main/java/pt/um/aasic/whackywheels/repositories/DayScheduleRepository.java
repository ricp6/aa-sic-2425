package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.DaySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DayScheduleRepository extends JpaRepository<DaySchedule, Long> {
}