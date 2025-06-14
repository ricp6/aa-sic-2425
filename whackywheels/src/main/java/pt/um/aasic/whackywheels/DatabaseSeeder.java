package pt.um.aasic.whackywheels;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.*; 
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final DayScheduleRepository dayScheduleRepository; 
    private final KartRepository kartRepository;             
    private final ReservationRepository reservationRepository; 
    private final SessionRepository sessionRepository;       
    private final ParticipantRepository participantRepository; 
    private final TimePerLapRepository timePerLapRepository; 
    private final ClassificationRepository classificationRepository; 
    private final NotificationRepository notificationRepository; 
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(
            UserRepository userRepository,
            TrackRepository trackRepository,
            DayScheduleRepository dayScheduleRepository,
            KartRepository kartRepository,
            ReservationRepository reservationRepository,
            SessionRepository sessionRepository,
            ParticipantRepository participantRepository,
            TimePerLapRepository timePerLapRepository,
            ClassificationRepository classificationRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.trackRepository = trackRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.kartRepository = kartRepository;
        this.reservationRepository = reservationRepository;
        this.sessionRepository = sessionRepository;
        this.participantRepository = participantRepository;
        this.timePerLapRepository = timePerLapRepository;
        this.classificationRepository = classificationRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) { // Verificar se já existem dados para evitar duplicatas
            System.out.println("Seeding database...");

            // 1. Criar Users (incluindo Owners)
            String hashedPassword = passwordEncoder.encode("password");

            Owner owner = new Owner();
            owner.setName("Admin Owner");
            owner.setEmail("owner@example.com");
            owner.setPassword(hashedPassword);
            userRepository.save(owner);

            User user1 = new User();
            user1.setName("Regular User 1");
            user1.setEmail("user1@example.com");
            user1.setPassword(hashedPassword);
            user1.setTotalSessions(5);
            user1.setVictories(2);
            user1.setTracksVisited(3);
            userRepository.save(user1);

            User user2 = new User();
            user2.setName("Regular User 2");
            user2.setEmail("user2@example.com");
            user2.setPassword(hashedPassword);
            user2.setTotalSessions(10);
            user2.setVictories(5);
            user2.setTracksVisited(4);
            userRepository.save(user2);

            // 2. Criar Tracks
            Track track1 = new Track();
            track1.setName("Kartódromo Internacional de Braga");
            track1.setAddress("Rua da Pista, 4700-000 Braga, Portugal");
            track1.setSlotPrice(new BigDecimal("25.00"));
            track1.setSlotDuration(15);
            track1.setEmail("braga.kart@example.com");
            track1.setPhoneNumber("912345678");
            track1.setIsAvailable(true);
            track1.setOwner(owner);
            track1.setImages(new HashSet<>(Arrays.asList("track1.jpg", "track2.jpg")));
            trackRepository.save(track1);

            Track track2 = new Track();
            track2.setName("Kartódromo de Fátima");
            track2.setAddress("Estrada da Mão, 2495-000 Fátima, Portugal");
            track2.setSlotPrice(new BigDecimal("20.00"));
            track2.setSlotDuration(10);
            track2.setEmail("fatima.kart@example.com");
            track2.setPhoneNumber("918765432");
            track2.setIsAvailable(true);
            track2.setOwner(owner);
            track2.setImages(new HashSet<>(Arrays.asList("track4.jpg")));
            trackRepository.save(track2);

            // 3. Criar DaySchedules
            DaySchedule daySchedule1 = new DaySchedule();
            daySchedule1.setDay(DayOfWeek.MONDAY);
            daySchedule1.setOpeningTime(LocalTime.of(9, 0));
            daySchedule1.setClosingTime(LocalTime.of(18, 0));
            daySchedule1.setTrack(track1);
            dayScheduleRepository.save(daySchedule1);

            DaySchedule daySchedule2 = new DaySchedule();
            daySchedule2.setDay(DayOfWeek.TUESDAY);
            daySchedule2.setOpeningTime(LocalTime.of(9, 0));
            daySchedule2.setClosingTime(LocalTime.of(18, 0));
            daySchedule2.setTrack(track1);
            dayScheduleRepository.save(daySchedule2);

            DaySchedule daySchedule3 = new DaySchedule();
            daySchedule3.setDay(DayOfWeek.WEDNESDAY);
            daySchedule3.setOpeningTime(LocalTime.of(10, 0));
            daySchedule3.setClosingTime(LocalTime.of(20, 0));
            daySchedule3.setTrack(track2);
            dayScheduleRepository.save(daySchedule3);

            // 4. Criar Karts (depende de Track)
            Kart kart1_track1 = new Kart();
            kart1_track1.setTrack(track1);
            kart1_track1.setKartNumber(1);
            kart1_track1.setIsAvailable(true);
            kart1_track1.setModel("Sodi RT8");
            kartRepository.save(kart1_track1);

            Kart kart2_track1 = new Kart();
            kart2_track1.setTrack(track1);
            kart2_track1.setKartNumber(2);
            kart2_track1.setIsAvailable(true);
            kart2_track1.setModel("Sodi LR5");
            kartRepository.save(kart2_track1);

            Kart kart1_track2 = new Kart();
            kart1_track2.setTrack(track2);
            kart1_track2.setKartNumber(1);
            kart1_track2.setIsAvailable(true);
            kart1_track2.setModel("CRG Centurion");
            kartRepository.save(kart1_track2);

            // 5. Criar Reservations (depende de Track e User)
            Reservation reservation1 = new Reservation();
            reservation1.setDate(LocalDate.now().plusDays(7)); // Uma semana no futuro
            reservation1.setStatus(ReservationStatus.PENDING);
            reservation1.setCreatedByUserId(user1.getId()); // User 1 faz a reserva
            reservation1.setTrack(track1);
            reservationRepository.save(reservation1);

            Reservation reservation2 = new Reservation();
            reservation2.setDate(LocalDate.now().plusDays(10));
            reservation2.setStatus(ReservationStatus.ACCEPTED);
            reservation2.setCreatedByUserId(user2.getId()); // User 2 faz a reserva
            reservation2.setTrack(track2);
            reservationRepository.save(reservation2);

            // 6. Criar Sessions (depende de Reservation)
            Session session1_res1 = new Session(LocalTime.of(14, 0), LocalTime.of(14, 15), reservation1);
            sessionRepository.save(session1_res1);

            Session session2_res1 = new Session(LocalTime.of(15, 0), LocalTime.of(15, 15), reservation1);
            sessionRepository.save(session2_res1);

            Session session1_res2 = new Session(LocalTime.of(11, 0), LocalTime.of(11, 20), reservation2);
            sessionRepository.save(session1_res2);

            // 7. Criar Participants (depende de User, Kart, Reservation)
            Participant participant1_res1 = new Participant(user1, kart1_track1, reservation1);
            participantRepository.save(participant1_res1);

            Participant participant2_res1 = new Participant(user2, kart2_track1, reservation1);
            participantRepository.save(participant2_res1);

            Participant participant1_res2 = new Participant(user2, kart1_track2, reservation2);
            participantRepository.save(participant1_res2);

            // 8. Criar TimePerLaps (depende de Participant, Session)
            TimePerLap tpl1_p1_s1 = new TimePerLap(1, 35.5, participant1_res1, session1_res1);
            timePerLapRepository.save(tpl1_p1_s1);
            TimePerLap tpl2_p1_s1 = new TimePerLap(2, 34.8, participant1_res1, session1_res1);
            timePerLapRepository.save(tpl2_p1_s1);

            TimePerLap tpl1_p2_s1 = new TimePerLap(1, 36.1, participant2_res1, session1_res1);
            timePerLapRepository.save(tpl1_p2_s1);

            // 9. Criar Classifications (depende de Session, Participant)
            Classification class1_s1_p1 = new Classification(1.0, 35.1, 34.8, session1_res1, participant1_res1);
            classificationRepository.save(class1_s1_p1);

            Classification class2_s1_p2 = new Classification(2.0, 36.5, 36.1, session1_res1, participant2_res1);
            classificationRepository.save(class2_s1_p2);

            // 10. Criar Notifications (depende de User)
            Notification notif1_user1 = new Notification();
            notif1_user1.setUser(user1);
            notif1_user1.setTitle("Nova Reserva Confirmada");
            notif1_user1.setBody("A sua reserva para " + track1.getName() + " foi confirmada.");
            notif1_user1.setIsRead(false);
            notificationRepository.save(notif1_user1);

            Notification notif1_user2 = new Notification();
            notif1_user2.setUser(user2);
            notif1_user2.setTitle("Atualização de Pontuação");
            notif1_user2.setBody("Parabéns! Você alcançou uma nova vitória.");
            notif1_user2.setIsRead(true);
            notificationRepository.save(notif1_user2);


            System.out.println("Database seeding complete.");
        } else {
            System.out.println("Database already seeded, skipping.");
        }
    }
}