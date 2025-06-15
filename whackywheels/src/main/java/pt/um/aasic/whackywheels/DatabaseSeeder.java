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
            owner.setProfilePicture("avatarPredet.jpg");
            userRepository.save(owner);

            User user1 = new User();
            user1.setName("Regular User 1");
            user1.setEmail("user1@example.com");
            user1.setPassword(hashedPassword);
            user1.setTotalSessions(5);
            user1.setVictories(2);
            user1.setTracksVisited(3);
            user1.setProfilePicture("avatarPredet.jpg");
            userRepository.save(user1);

            User user2 = new User();
            user2.setName("Regular User 2");
            user2.setEmail("user2@example.com");
            user2.setPassword(hashedPassword);
            user2.setTotalSessions(10);
            user2.setVictories(5);
            user2.setTracksVisited(4);
            user2.setProfilePicture("avatarPredet.jpg");
            userRepository.save(user2);

            // 2. Criar Tracks
            Track track1 = new Track();
            track1.setName("Kartódromo Internacional de Braga");
            track1.setAddress("Rua da Pista, 4700-000, Braga");
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
            track2.setAddress("Estrada da Mão, 2495-000, Fátima");
            track2.setSlotPrice(new BigDecimal("20.00"));
            track2.setSlotDuration(5);
            track2.setEmail("fatima.kart@example.com");
            track2.setPhoneNumber("918765432");
            track2.setIsAvailable(true);
            track2.setOwner(owner);
            track2.setImages(new HashSet<>(Arrays.asList("track4.jpg")));
            trackRepository.save(track2);

            // Horários para Kartódromo Internacional de Braga (track1)
            DaySchedule ds_braga_mon = new DaySchedule();
            ds_braga_mon.setDay(DayOfWeek.MONDAY);
            ds_braga_mon.setOpeningTime(LocalTime.of(9, 0));
            ds_braga_mon.setClosingTime(LocalTime.of(18, 0));
            ds_braga_mon.setTrack(track1);
            dayScheduleRepository.save(ds_braga_mon);

            DaySchedule ds_braga_tue = new DaySchedule();
            ds_braga_tue.setDay(DayOfWeek.TUESDAY);
            ds_braga_tue.setOpeningTime(LocalTime.of(9, 0));
            ds_braga_tue.setClosingTime(LocalTime.of(18, 0));
            ds_braga_tue.setTrack(track1);
            dayScheduleRepository.save(ds_braga_tue);

            DaySchedule ds_braga_wed = new DaySchedule();
            ds_braga_wed.setDay(DayOfWeek.WEDNESDAY);
            ds_braga_wed.setOpeningTime(LocalTime.of(9, 0));
            ds_braga_wed.setClosingTime(LocalTime.of(18, 0));
            ds_braga_wed.setTrack(track1);
            dayScheduleRepository.save(ds_braga_wed);

            DaySchedule ds_braga_thu = new DaySchedule();
            ds_braga_thu.setDay(DayOfWeek.THURSDAY);
            ds_braga_thu.setOpeningTime(LocalTime.of(10, 0));
            ds_braga_thu.setClosingTime(LocalTime.of(20, 0));
            ds_braga_thu.setTrack(track1);
            dayScheduleRepository.save(ds_braga_thu);

            DaySchedule ds_braga_fri = new DaySchedule();
            ds_braga_fri.setDay(DayOfWeek.FRIDAY);
            ds_braga_fri.setOpeningTime(LocalTime.of(10, 0));
            ds_braga_fri.setClosingTime(LocalTime.of(22, 0));
            ds_braga_fri.setTrack(track1);
            dayScheduleRepository.save(ds_braga_fri);

            DaySchedule ds_braga_sat = new DaySchedule();
            ds_braga_sat.setDay(DayOfWeek.SATURDAY);
            ds_braga_sat.setOpeningTime(LocalTime.of(9, 0));
            ds_braga_sat.setClosingTime(LocalTime.of(23, 0));
            ds_braga_sat.setTrack(track1);
            dayScheduleRepository.save(ds_braga_sat);

            DaySchedule ds_braga_sun = new DaySchedule();
            ds_braga_sun.setDay(DayOfWeek.SUNDAY);
            ds_braga_sun.setOpeningTime(LocalTime.of(9, 0));
            ds_braga_sun.setClosingTime(LocalTime.of(20, 0));
            ds_braga_sun.setTrack(track1);
            dayScheduleRepository.save(ds_braga_sun);

            // Horários para Kartódromo de Fátima (track2)
            DaySchedule ds_fatima_tue = new DaySchedule();
            ds_fatima_tue.setDay(DayOfWeek.TUESDAY);
            ds_fatima_tue.setOpeningTime(LocalTime.of(10, 0));
            ds_fatima_tue.setClosingTime(LocalTime.of(19, 0));
            ds_fatima_tue.setTrack(track2);
            dayScheduleRepository.save(ds_fatima_tue);

            DaySchedule ds_fatima_thu = new DaySchedule();
            ds_fatima_thu.setDay(DayOfWeek.THURSDAY);
            ds_fatima_thu.setOpeningTime(LocalTime.of(10, 0));
            ds_fatima_thu.setClosingTime(LocalTime.of(19, 0));
            ds_fatima_thu.setTrack(track2);
            dayScheduleRepository.save(ds_fatima_thu);

            DaySchedule ds_fatima_fri = new DaySchedule();
            ds_fatima_fri.setDay(DayOfWeek.FRIDAY);
            ds_fatima_fri.setOpeningTime(LocalTime.of(10, 0));
            ds_fatima_fri.setClosingTime(LocalTime.of(21, 0));
            ds_fatima_fri.setTrack(track2);
            dayScheduleRepository.save(ds_fatima_fri);

            DaySchedule ds_fatima_sat = new DaySchedule();
            ds_fatima_sat.setDay(DayOfWeek.SATURDAY);
            ds_fatima_sat.setOpeningTime(LocalTime.of(9, 0));
            ds_fatima_sat.setClosingTime(LocalTime.of(22, 0));
            ds_fatima_sat.setTrack(track2);
            dayScheduleRepository.save(ds_fatima_sat);

            DaySchedule ds_fatima_sun = new DaySchedule();
            ds_fatima_sun.setDay(DayOfWeek.SUNDAY);
            ds_fatima_sun.setOpeningTime(LocalTime.of(9, 0));
            ds_fatima_sun.setClosingTime(LocalTime.of(19, 0));
            ds_fatima_sun.setTrack(track2);
            dayScheduleRepository.save(ds_fatima_sun);

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

            Reservation completedReservation1 = new Reservation();
            completedReservation1.setDate(LocalDate.now().minusDays(15));
            completedReservation1.setStatus(ReservationStatus.CONCLUDED);
            completedReservation1.setCreatedByUserId(user1.getId());
            completedReservation1.setTrack(track1);
            reservationRepository.save(completedReservation1);

            Reservation completedReservation2 = new Reservation();
            completedReservation2.setDate(LocalDate.now().minusDays(30));
            completedReservation2.setStatus(ReservationStatus.CONCLUDED);
            completedReservation2.setCreatedByUserId(user2.getId());
            completedReservation2.setTrack(track1);
            reservationRepository.save(completedReservation2);

            Reservation completedReservation3 = new Reservation();
            completedReservation3.setDate(LocalDate.now().minusDays(10));
            completedReservation3.setStatus(ReservationStatus.CONCLUDED);
            completedReservation3.setCreatedByUserId(user1.getId());
            completedReservation3.setTrack(track2);
            reservationRepository.save(completedReservation3);

            // 6. Criar Sessions (depende de Reservation)
            Session session1_res1 = new Session(LocalTime.of(14, 0), LocalTime.of(14, 15), reservation1, null, null);
            sessionRepository.save(session1_res1);

            Session session2_res1 = new Session(LocalTime.of(15, 0), LocalTime.of(15, 15), reservation1, null, null);
            sessionRepository.save(session2_res1);

            Session session1_res2 = new Session(LocalTime.of(11, 0), LocalTime.of(11, 20), reservation2, null, null);
            sessionRepository.save(session1_res2);

            Session completedSession1 = new Session(LocalTime.of(10, 0), LocalTime.of(10, 15), completedReservation1, LocalTime.of(10, 0), LocalTime.of(10, 15));
            sessionRepository.save(completedSession1);

            Session completedSession2 = new Session(LocalTime.of(11, 0), LocalTime.of(11, 15), completedReservation1, LocalTime.of(11, 0), LocalTime.of(11, 15));
            sessionRepository.save(completedSession2);

            Session completedSession3 = new Session(LocalTime.of(14, 0), LocalTime.of(14, 15), completedReservation2, LocalTime.of(14, 0), LocalTime.of(14, 15));
            sessionRepository.save(completedSession3);

            Session completedSession4 = new Session(LocalTime.of(16, 0), LocalTime.of(16, 20), completedReservation3, LocalTime.of(16, 0), LocalTime.of(16, 20));
            sessionRepository.save(completedSession4);

            // 7. Criar Participants (depende de User, Kart, Reservation)
            Participant participant1_res1 = new Participant(user1, kart1_track1, reservation1);
            participantRepository.save(participant1_res1);

            Participant participant2_res1 = new Participant(user2, kart2_track1, reservation1);
            participantRepository.save(participant2_res1);

            Participant participant1_res2 = new Participant(user2, kart1_track2, reservation2);
            participantRepository.save(participant1_res2);

            Participant completedParticipant1 = new Participant(user1, kart1_track1, completedReservation1);
            participantRepository.save(completedParticipant1);

            Participant completedParticipant2 = new Participant(user2, kart2_track1, completedReservation1);
            participantRepository.save(completedParticipant2);

            Participant completedParticipant3 = new Participant(user2, kart1_track1, completedReservation2);
            participantRepository.save(completedParticipant3);

            Participant completedParticipant4 = new Participant(user1, kart2_track1, completedReservation2);
            participantRepository.save(completedParticipant4);

            Participant completedParticipant5 = new Participant(user1, kart1_track2, completedReservation3);
            participantRepository.save(completedParticipant5);

            // 8. Criar TimePerLaps (depende de Participant, Session)
            // Sessão 1 concluída
            TimePerLap tpl1_cp1_cs1 = new TimePerLap(1, 35.2, completedParticipant1, completedSession1);
            timePerLapRepository.save(tpl1_cp1_cs1);
            TimePerLap tpl2_cp1_cs1 = new TimePerLap(2, 34.9, completedParticipant1, completedSession1);
            timePerLapRepository.save(tpl2_cp1_cs1);
            TimePerLap tpl3_cp1_cs1 = new TimePerLap(3, 34.7, completedParticipant1, completedSession1);
            timePerLapRepository.save(tpl3_cp1_cs1);

            TimePerLap tpl1_cp2_cs1 = new TimePerLap(1, 36.5, completedParticipant2, completedSession1);
            timePerLapRepository.save(tpl1_cp2_cs1);
            TimePerLap tpl2_cp2_cs1 = new TimePerLap(2, 36.2, completedParticipant2, completedSession1);
            timePerLapRepository.save(tpl2_cp2_cs1);
            TimePerLap tpl3_cp2_cs1 = new TimePerLap(3, 35.9, completedParticipant2, completedSession1);
            timePerLapRepository.save(tpl3_cp2_cs1);

            // Sessão 2 concluída
            TimePerLap tpl1_cp1_cs2 = new TimePerLap(1, 34.8, completedParticipant1, completedSession2);
            timePerLapRepository.save(tpl1_cp1_cs2);
            TimePerLap tpl2_cp1_cs2 = new TimePerLap(2, 34.5, completedParticipant1, completedSession2);
            timePerLapRepository.save(tpl2_cp1_cs2);

            TimePerLap tpl1_cp2_cs2 = new TimePerLap(1, 35.7, completedParticipant2, completedSession2);
            timePerLapRepository.save(tpl1_cp2_cs2);
            TimePerLap tpl2_cp2_cs2 = new TimePerLap(2, 35.3, completedParticipant2, completedSession2);
            timePerLapRepository.save(tpl2_cp2_cs2);

            // Sessão 3 concluída
            TimePerLap tpl1_cp3_cs3 = new TimePerLap(1, 36.0, completedParticipant3, completedSession3);
            timePerLapRepository.save(tpl1_cp3_cs3);
            TimePerLap tpl2_cp3_cs3 = new TimePerLap(2, 35.8, completedParticipant3, completedSession3);
            timePerLapRepository.save(tpl2_cp3_cs3);
            TimePerLap tpl3_cp3_cs3 = new TimePerLap(3, 35.5, completedParticipant3, completedSession3);
            timePerLapRepository.save(tpl3_cp3_cs3);

            TimePerLap tpl1_cp4_cs3 = new TimePerLap(1, 37.2, completedParticipant4, completedSession3);
            timePerLapRepository.save(tpl1_cp4_cs3);
            TimePerLap tpl2_cp4_cs3 = new TimePerLap(2, 36.9, completedParticipant4, completedSession3);
            timePerLapRepository.save(tpl2_cp4_cs3);

            // Sessão 4 concluída (pista 2)
            TimePerLap tpl1_cp5_cs4 = new TimePerLap(1, 38.5, completedParticipant5, completedSession4);
            timePerLapRepository.save(tpl1_cp5_cs4);
            TimePerLap tpl2_cp5_cs4 = new TimePerLap(2, 37.8, completedParticipant5, completedSession4);
            timePerLapRepository.save(tpl2_cp5_cs4);
            TimePerLap tpl3_cp5_cs4 = new TimePerLap(3, 37.5, completedParticipant5, completedSession4);
            timePerLapRepository.save(tpl3_cp5_cs4);
            TimePerLap tpl4_cp5_cs4 = new TimePerLap(4, 37.2, completedParticipant5, completedSession4);
            timePerLapRepository.save(tpl4_cp5_cs4);

            // 9. Criar Classifications (depende de Session, Participant)
            // Classificações detalhadas para sessões concluídas
            Classification class1_cs1_cp1 = new Classification(1.0, 34.9, 34.7, completedSession1, completedParticipant1);
            classificationRepository.save(class1_cs1_cp1);
            Classification class2_cs1_cp2 = new Classification(2.0, 36.2, 35.9, completedSession1, completedParticipant2);
            classificationRepository.save(class2_cs1_cp2);

            Classification class1_cs2_cp1 = new Classification(1.0, 34.6, 34.5, completedSession2, completedParticipant1);
            classificationRepository.save(class1_cs2_cp1);
            Classification class2_cs2_cp2 = new Classification(2.0, 35.5, 35.3, completedSession2, completedParticipant2);
            classificationRepository.save(class2_cs2_cp2);

            Classification class1_cs3_cp3 = new Classification(1.0, 35.8, 35.5, completedSession3, completedParticipant3);
            classificationRepository.save(class1_cs3_cp3);
            Classification class2_cs3_cp4 = new Classification(2.0, 37.0, 36.9, completedSession3, completedParticipant4);
            classificationRepository.save(class2_cs3_cp4);

            Classification class1_cs4_cp5 = new Classification(1.0, 37.7, 37.2, completedSession4, completedParticipant5);
            classificationRepository.save(class1_cs4_cp5);

            // 10. Criar Notifications (depende de User)
            Notification notif1_user1 = new Notification();
            notif1_user1.setUser(user1);
            notif1_user1.setTitle("Nova Reserva Confirmada");
            notif1_user1.setBody("A sua reserva para " + track1.getName() + " foi confirmada.");
            notif1_user1.setIsRead(false);
            notificationRepository.save(notif1_user1);

            System.out.println("Database seeding complete.");
        } else {
            System.out.println("Database already seeded, skipping.");
        }
    }
}