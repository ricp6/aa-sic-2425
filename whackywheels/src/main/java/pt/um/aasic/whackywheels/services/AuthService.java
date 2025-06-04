package pt.um.aasic.whackywheels.services;

import pt.um.aasic.whackywheels.dtos.LoginRequestDTO;
import pt.um.aasic.whackywheels.dtos.RegisterRequestDTO;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerNewUser(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email in use");
        }

        User newUser = new User();
        newUser.setName(request.getName());

        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setProfilePicture(request.getProfilePic());

        return userRepository.save(newUser);
    }

    @Transactional(readOnly = true)
    public User authenticateUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid email or password");
        }

        return user;
    }
}