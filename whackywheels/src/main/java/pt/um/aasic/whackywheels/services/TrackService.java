package pt.um.aasic.whackywheels.services;

import org.springframework.cglib.core.Local;
import pt.um.aasic.whackywheels.dtos.kart.KartDTO;
import pt.um.aasic.whackywheels.dtos.track.*;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.DayScheduleRepository;
import pt.um.aasic.whackywheels.repositories.KartRepository;
import pt.um.aasic.whackywheels.repositories.UserRepository; // Precisamos do OwnerRepository para buscar o Owner
import pt.um.aasic.whackywheels.repositories.TrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrackService {

    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final KartRepository kartRepository;

    public TrackService(TrackRepository trackRepository, UserRepository userRepository, DayScheduleRepository dayScheduleRepository, KartRepository kartRepository) {
        this.trackRepository = trackRepository;
        this.userRepository = userRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.kartRepository = kartRepository;
    }

    @Transactional(readOnly = true)
    public List<TrackResponseDTO> findAllTracks() {
        return trackRepository.findAll().stream()
                .map(track -> new TrackResponseDTO(
                        track.getId(),
                        track.getName(),
                        track.getCity(),
                        track.getBannerImage(),
                        track.getIsAvailable()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrackRecordResponseDTO> findAllTracksRecords(Long userId)   {
        // 1. Fetch overall minimum lap times for all tracks
        List<Object[]> overallRecordsRaw = trackRepository.findOverallMinLapTimesPerTrack();
        // Convert to a Map for efficient lookup (trackId -> overallBestTime)
        Map<Long, Double> overallRecordsMap = overallRecordsRaw.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // The track ID
                        row -> (Double) row[1] // The minimum lap time
                ));

        // 2. Fetch personal minimum lap times for the specific user on tracks they participated in
        List<Object[]> personalRecordsRaw = trackRepository.findPersonalMinLapTimesForUser(userId);
        // Convert to a Map for efficient lookup (trackId -> personalBestTime)
        Map<Long, Double> personalRecordsMap = personalRecordsRaw.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Double) row[1]
                ));

        // 4. Map each Track to a TrackRecordResponseDTO, ensure every track is returned even if there are no records set for it
        return trackRepository.findAll().stream()
                .map(track -> {
                    // Get overall best time for this track, or null if no record exists
                    Double trackRecord = overallRecordsMap.get(track.getId());
                    // Get personal best time for this user on this track, or null if no record exists
                    Double personalRecord = personalRecordsMap.get(track.getId());

                    return new TrackRecordResponseDTO(
                            track.getId(),
                            personalRecord,
                            trackRecord
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public TrackDetailsResponseDTO findTrack(Long id) {
        // *** OPTIMIZED LINE: Use the custom query to fetch Track with day schedules and karts ***
        Track track = trackRepository.findByIdWithDaySchedulesAndKarts(id)
                .orElseThrow(() -> new IllegalArgumentException("Track with ID " + id + " not found."));

        // 1. Get available karts count
        // Now 'track.getKarts()' is already initialized because of JOIN FETCH
        Integer availableKartsCount = 0;
        if (track.getKarts() != null) {
            availableKartsCount = (int) track.getKarts().stream()
                    .filter(Kart::getIsAvailable)
                    .count();
        }

        // 2. Map DaySchedule entities to DayScheduleDTOs
        // 'track.getDaySchedules()' is also initialized
        Set<DayScheduleDTO> scheduleDTOs = null;
        if (track.getDaySchedules() != null) {
            scheduleDTOs = track.getDaySchedules().stream()
                    .map(ds -> new DayScheduleDTO(ds.getDay(), ds.getOpeningTime(), ds.getClosingTime()))
                    // Optional: Sort schedules by day of week for consistent display
                    .sorted(Comparator.comparing(DayScheduleDTO::getDay))
                    .collect(Collectors.toCollection(java.util.LinkedHashSet::new)); // Use LinkedHashSet to preserve order if sorted
        }

        // 3. Get Track Rankings as List<Object[]> and then map to List<TrackRankingDTO>
        List<Object[]> rawRankings = trackRepository.findTopRankingsByTrackId(track.getId());

        List<TrackRankingDTO> rankings = new ArrayList<>();
        for (Object[] row : rawRankings) {
            String driverName = (String) row[0];
            LocalDate sessionDateTime = (LocalDate) row[1]; // Expected type from r.date
            Integer kartNumber = (Integer) row[2];
            String profilePicture = (String) row[3];
            Double lapTime = (Double) row[4];
            // Create TrackRankingDTO.
            // Using the constructor that takes LocalDateTime for the date.
            rankings.add(new TrackRankingDTO(driverName, sessionDateTime, kartNumber, lapTime, profilePicture));
        }

        // Map and return the complete DTO
        return new TrackDetailsResponseDTO(
                track.getId(),
                track.getName(),
                track.getAddress(),
                track.getSlotPrice(),
                track.getSlotDuration(),
                track.getEmail(),
                track.getPhoneNumber(),
                track.getImages(),
                track.getIsAvailable(),
                track.getOwner().getId(),
                availableKartsCount,
                scheduleDTOs,
                rankings
        );
    }

    @Transactional(readOnly = true)
    public List<TrackResponseDTO> findOwnedTracks(Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + ownerId + " not found."));

        if (!(user instanceof Owner)) {
            throw new IllegalArgumentException("User with ID " + ownerId + " is not an Owner and cannot have tracks.");
        }
        Owner owner = (Owner) user;

        return owner.getTracks().stream()
                .map(track -> new TrackResponseDTO(
                        track.getId(),
                        track.getName(),
                        track.getCity(),
                        track.getBannerImage(),
                        track.getIsAvailable()
                ))
                .toList();
    }

    @Transactional
    public void setTrackAvailability(Long trackId, Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + ownerId + " not found."));

        if (!(user instanceof Owner)) {
            throw new IllegalArgumentException("User with ID " + ownerId + " is not an Owner and cannot update track availability.");
        }
        Owner owner = (Owner) user;

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track with ID " + trackId + " not found."));

        if (!track.getOwner().equals(owner)) {
            throw new IllegalArgumentException("Track with ID " + trackId + " does not belong to Owner with ID " + ownerId + ".");
        }

        track.setIsAvailable(!track.getIsAvailable()); // Toggle availability
        trackRepository.save(track);
    }
    
    @Transactional
    public Track createTrack(TrackCreateRequestDTO request, Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + ownerId + " not found."));

        if (!(user instanceof Owner)) {
            throw new IllegalArgumentException("User with ID " + ownerId + " is not an Owner and cannot create a track.");
        }
        Owner owner = (Owner) user;

        Track newTrack = new Track();
        newTrack.setName(request.getName());
        newTrack.setAddress(request.getAddress());
        newTrack.setSlotPrice(request.getSlotPrice());
        newTrack.setSlotDuration(request.getSlotDuration());
        newTrack.setEmail(request.getEmail());
        newTrack.setPhoneNumber(request.getPhoneNumber());
        newTrack.setImages(request.getImages());
        newTrack.setIsAvailable(false);
        newTrack.setOwner(owner);

        newTrack = trackRepository.save(newTrack);

        if (request.getDaySchedules() == null || request.getDaySchedules().isEmpty()) {
            throw new IllegalArgumentException("Day schedules are required for a track.");
        }
        Set<DaySchedule> daySchedules = new HashSet<>();
        for (DayScheduleDTO dto : request.getDaySchedules()) {
            DaySchedule daySchedule = new DaySchedule();
            daySchedule.setDay(dto.getDay());
            daySchedule.setOpeningTime(dto.getOpeningTime());
            daySchedule.setClosingTime(dto.getClosingTime());
            daySchedule.setTrack(newTrack);
            daySchedules.add(daySchedule);
        }
        dayScheduleRepository.saveAll(daySchedules);
        newTrack.setDaySchedules(daySchedules);

        if (request.getKarts() == null || request.getKarts().isEmpty()) {
            throw new IllegalArgumentException("At least one kart is required for a track.");
        }
        Set<Kart> karts = new HashSet<>();
        for (KartDTO dto : request.getKarts()) {
            Kart kart = new Kart();
            kart.setKartNumber(dto.getKartNumber());
            kart.setModel(dto.getModel());
            kart.setIsAvailable(true);
            kart.setTrack(newTrack);
            karts.add(kart);
        }
        kartRepository.saveAll(karts);
        newTrack.setKarts(karts);


        if (owner.getTracks() == null) {
            owner.setTracks(new HashSet<>());
        }
        owner.getTracks().add(newTrack);
        userRepository.save(owner);

        return newTrack;
    }

    @Transactional
    public void updateTrack(Long trackId, TrackUpdateRequestDTO request, Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + ownerId + " not found."));

        if (!(user instanceof Owner)) {
            throw new IllegalArgumentException("User with ID " + ownerId + " is not an Owner and cannot update a track.");
        }
        Owner owner = (Owner) user;

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track with ID " + trackId + " not found."));

        if (!track.getOwner().equals(owner)) {
            throw new IllegalArgumentException("Track with ID " + trackId + " does not belong to Owner with ID " + ownerId + ".");
        }

        // Update basic fields
        track.setName(request.getName());
        track.setSlotPrice(request.getSlotPrice());
        track.setSlotDuration(request.getSlotDuration());
        track.setEmail(request.getEmail());
        track.setPhoneNumber(request.getPhoneNumber());
        track.setImages(request.getImages());

        // Update day schedules
        if (request.getDaySchedules() != null && !request.getDaySchedules().isEmpty()) {
            Set<DaySchedule> daySchedules = new HashSet<>();
            for (DayScheduleDTO dto : request.getDaySchedules()) {
                DaySchedule daySchedule = new DaySchedule();
                daySchedule.setDay(dto.getDay());
                daySchedule.setOpeningTime(dto.getOpeningTime());
                daySchedule.setClosingTime(dto.getClosingTime());
                daySchedule.setTrack(track);
                daySchedules.add(daySchedule);
            }
            dayScheduleRepository.saveAll(daySchedules);
            track.setDaySchedules(daySchedules);
        }
        trackRepository.save(track);
    }

    @Transactional(readOnly = true)
    public List<TrackFilterResponseDTO> getTrackDetaislForFilters() {
        List<Track> tracks = trackRepository.findAll();
        return tracks.stream()
                .map(track -> {
                    int maxKarts = kartRepository.findByTrackAndIsAvailable(track, true).size();

                    List<DaySchedule> openSchedules = dayScheduleRepository.findByTrack(track);
                    Set<DayOfWeek> openDays = openSchedules.stream()
                                                            .map(DaySchedule::getDay)
                                                            .collect(Collectors.toSet());

                    List<DayOfWeek> allDaysOfWeek = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                                                                  DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);

                    List<DayOfWeek> notOpen = allDaysOfWeek.stream()
                                                                .filter(day -> !openDays.contains(day))
                                                                .collect(Collectors.toList());

                    return new TrackFilterResponseDTO(
                            track.getId(),
                            maxKarts,
                            notOpen
                    );
                })
                .toList();
    }
}
