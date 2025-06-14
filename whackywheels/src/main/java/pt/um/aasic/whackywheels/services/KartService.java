package pt.um.aasic.whackywheels.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pt.um.aasic.whackywheels.dtos.kart.KartRequestDTO;
import pt.um.aasic.whackywheels.dtos.kart.KartResponseDTO;
import pt.um.aasic.whackywheels.entities.Kart;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.repositories.KartRepository;
import pt.um.aasic.whackywheels.repositories.TrackRepository;

import java.util.List;
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

    @Transactional
    public KartResponseDTO createKart(KartRequestDTO kart, Long ownerId) {
        if (kart.getKartNumber() == null || kart.getKartNumber() <= 0) {
            throw new IllegalArgumentException("Kart number must be a positive integer.");
        }

        if (kart.getModel() == null || kart.getModel().isEmpty()) {
            throw new IllegalArgumentException("Kart model cannot be empty.");
        }

        Track track = trackRepository.findById(kart.getTrackId())
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + kart.getTrackId()));
        if (!track.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("You do not have permission to create a kart for this track.");
        }

        if (kartRepository.existsByKartNumberAndTrack(kart.getKartNumber(), track)) {
            throw new IllegalArgumentException("A kart with this number already exists on the track.");
        }
        
        Kart newKart = new Kart();
        newKart.setKartNumber(kart.getKartNumber());
        newKart.setModel(kart.getModel());
        newKart.setIsAvailable(kart.getIsAvailable());
        newKart.setTrack(track);

        Kart savedKart = kartRepository.save(newKart);
        return mapKartToKartResponseDTO(savedKart);
    }

    @Transactional
    public KartResponseDTO updateKart(Long kartId, KartRequestDTO kartDTO, Long ownerId) {
        Kart existingKart = kartRepository.findById(kartId)
                .orElseThrow(() -> new IllegalArgumentException("Kart not found with ID: " + kartId));

        Track track = existingKart.getTrack();
        if (!track.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("You do not have permission to update this kart.");
        }
        
        Track dtoTrack = trackRepository.findById(kartDTO.getTrackId())
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + kartDTO.getTrackId()));
        
        if (dtoTrack.getOwner().getId() != ownerId) {
            throw new IllegalArgumentException("You cannot change the track of this kart to a track you do not own.");
        }

        if (kartDTO.getKartNumber() != null && kartDTO.getKartNumber() <= 0) {
            throw new IllegalArgumentException("Kart number must be a positive integer.");
        }

        if (kartDTO.getModel() == null || kartDTO.getModel().isEmpty()) {
            throw new IllegalArgumentException("Kart model cannot be empty.");
        }

        if (kartRepository.existsByKartNumberAndTrack(kartDTO.getKartNumber(), track)) {
            throw new IllegalArgumentException("A kart with this number already exists on the track.");
        }

        existingKart.setKartNumber(kartDTO.getKartNumber());
        existingKart.setModel(kartDTO.getModel());
        existingKart.setIsAvailable(kartDTO.getIsAvailable());

        Kart updatedKart = kartRepository.save(existingKart);
        return mapKartToKartResponseDTO(updatedKart);
    }
}