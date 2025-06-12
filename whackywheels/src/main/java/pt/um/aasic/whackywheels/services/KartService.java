package pt.um.aasic.whackywheels.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.um.aasic.whackywheels.dtos.KartResponseDTO;
import pt.um.aasic.whackywheels.entities.Kart;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.repositories.KartRepository;
import pt.um.aasic.whackywheels.repositories.TrackRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class KartService {

    private final KartRepository kartRepository;
    private final TrackRepository trackRepository;

    public KartService(KartRepository kartRepository, TrackRepository trackRepository) {
        this.kartRepository = kartRepository;
        this.trackRepository = trackRepository;
    }

    @Transactional(readOnly = true)
    public List<KartResponseDTO> getAllKarts() {
        return kartRepository.findAll().stream()
                .map(this::mapKartToKartResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public KartResponseDTO getKartById(Long id) {
        return kartRepository.findById(id)
                .map(this::mapKartToKartResponseDTO)
                .orElseThrow(() -> new IllegalArgumentException("Kart not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<KartResponseDTO> getKartsByTrackId(Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));
        return kartRepository.findByTrack(track).stream()
                .map(this::mapKartToKartResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<KartResponseDTO> getAvailableKarts(Long trackId) {

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        if (!track.getIsAvailable()) {
            throw new IllegalArgumentException("Track is not available.");
        }

        List<Kart> kartsOnTrackAndAvailable = kartRepository.findByTrackAndIsAvailable(track, true);

        if (kartsOnTrackAndAvailable.isEmpty()) {
            return null;
        }

        return kartsOnTrackAndAvailable.stream()
                .map(this::mapKartToKartResponseDTO)
                .collect(Collectors.toList());
    }

    private KartResponseDTO mapKartToKartResponseDTO(Kart kart) {
        return new KartResponseDTO(
                kart.getId(),
                kart.getKartNumber(),
                kart.getModel()
        );
    }
}