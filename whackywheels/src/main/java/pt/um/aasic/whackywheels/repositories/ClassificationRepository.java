package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Classification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassificationRepository extends JpaRepository<Classification, Long> {
}
