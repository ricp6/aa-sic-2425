package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}