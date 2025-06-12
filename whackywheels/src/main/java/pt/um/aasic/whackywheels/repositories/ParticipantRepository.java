package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Participant;
import pt.um.aasic.whackywheels.entities.ReservationStatus;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}