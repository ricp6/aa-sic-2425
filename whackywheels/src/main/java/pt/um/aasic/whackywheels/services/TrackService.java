package pt.um.aasic.whackywheels.services;

import pt.um.aasic.whackywheels.dtos.DayScheduleDTO;
import pt.um.aasic.whackywheels.dtos.KartDTO;
import pt.um.aasic.whackywheels.dtos.TrackCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.TrackResponseDTO;
import pt.um.aasic.whackywheels.entities.*;
import pt.um.aasic.whackywheels.repositories.DayScheduleRepository;
import pt.um.aasic.whackywheels.repositories.KartRepository;
import pt.um.aasic.whackywheels.repositories.UserRepository; // Precisamos do OwnerRepository para buscar o Owner
import pt.um.aasic.whackywheels.repositories.TrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.List;
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

    public List<TrackResponseDTO> findAllTracks() {
        return trackRepository.findAll().stream()
                .map(track -> new TrackResponseDTO(
                        track.getId(),
                        track.getName(),
                        track.getAddress(),
                        track.getSlotPrice(),
                        track.getSlotDuration(),
                        track.getEmail(),
                        track.getPhoneNumber(),
                        track.getImages(),
                        track.getIsAvailable(),
                        track.getOwner() != null ? track.getOwner().getId() : null
                ))
                .collect(Collectors.toList());
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
}
