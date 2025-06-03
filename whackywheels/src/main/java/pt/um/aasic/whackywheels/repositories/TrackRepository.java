package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
}
