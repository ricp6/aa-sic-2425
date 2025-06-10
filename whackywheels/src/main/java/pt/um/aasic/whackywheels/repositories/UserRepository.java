package pt.um.aasic.whackywheels.repositories;
import org.springframework.stereotype.Repository;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.entities.Owner;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String nameQuery, String emailQuery);
}
