package pt.um.aasic.whackywheels.repositories;
import org.springframework.stereotype.Repository;
import pt.um.aasic.whackywheels.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
}
