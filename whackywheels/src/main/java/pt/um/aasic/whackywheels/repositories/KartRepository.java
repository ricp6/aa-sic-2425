package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Kart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KartRepository extends JpaRepository<Kart, Long> {
}
