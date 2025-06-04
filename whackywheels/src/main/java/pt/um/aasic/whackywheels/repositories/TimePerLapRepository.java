package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.TimePerLap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimePerLapRepository extends JpaRepository<TimePerLap, Long> {
}
