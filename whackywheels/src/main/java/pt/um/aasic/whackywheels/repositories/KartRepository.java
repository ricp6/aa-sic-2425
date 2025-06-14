package pt.um.aasic.whackywheels.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.um.aasic.whackywheels.entities.Kart;
import pt.um.aasic.whackywheels.entities.Track;

import java.util.List;

@Repository
public interface KartRepository extends JpaRepository<Kart, Long> {
    List<Kart> findByTrack(Track track);
    List<Kart> findByTrackAndIsAvailable(Track track, Boolean isAvailable);
    boolean existsByKartNumberAndTrack(Integer kartNumber, Track track);
}