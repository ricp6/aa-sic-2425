package pt.um.aasic.whackywheels.repositories;

import pt.um.aasic.whackywheels.entities.Reservation;
import pt.um.aasic.whackywheels.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    //List<Reservation> findByTrackIdAndReservationDate(Long trackId, LocalDate reservationDate);

    //List<Reservation> findByParticipants_UserId(Long userId);

    //List<Reservation> findByTrackIdAndReservationDateBetween(Long trackId, LocalDateTime startOfDay, LocalDateTime endOfDay);
    List<Reservation> findByParticipants_User(User user);
}
