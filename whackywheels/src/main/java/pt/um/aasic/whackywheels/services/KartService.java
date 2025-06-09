package pt.um.aasic.whackywheels.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.um.aasic.whackywheels.dtos.KartResponseDTO;
import pt.um.aasic.whackywheels.entities.Kart;
import pt.um.aasic.whackywheels.entities.ReservationStatus;
import pt.um.aasic.whackywheels.entities.Track;
import pt.um.aasic.whackywheels.repositories.KartRepository;
import pt.um.aasic.whackywheels.repositories.ParticipantRepository;
import pt.um.aasic.whackywheels.repositories.TrackRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class KartService {

    private final KartRepository kartRepository;
    private final TrackRepository trackRepository;
    private final ParticipantRepository participantRepository;

    public KartService(KartRepository kartRepository, TrackRepository trackRepository, ParticipantRepository participantRepository) {
        this.kartRepository = kartRepository;
        this.trackRepository = trackRepository;
        this.participantRepository = participantRepository;
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
    public List<KartResponseDTO> getAvailableKartsForTrackAndSession(Long trackId, LocalDateTime sessionStart, LocalDateTime sessionEnd) {
      
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalArgumentException("Track not found with ID: " + trackId));

        List<Kart> kartsOnTrackAndAvailable = kartRepository.findByTrackAndIsAvailable(track, true);

        Set<Long> occupiedKartIds = participantRepository
            .findKartsOccupiedBySessionOverlap(
                track.getId(), // Passa o ID da pista
                sessionStart.toLocalDate().atStartOfDay(), // Início do dia da sessão
                sessionStart.toLocalDate().atTime(23, 59, 59), // Fim do dia da sessão
                sessionStart.toLocalTime(), // Hora de início da sessão 
                sessionEnd.toLocalTime(),   // Hora de fim da sessão 
                ReservationStatus.PENDING, 
                ReservationStatus.ACCEPTED 
            )
            .stream()
            .filter(participant -> participant.getKart() != null)
            .map(participant -> participant.getKart().getId())
            .collect(Collectors.toSet());

        return kartsOnTrackAndAvailable.stream()
                .filter(kart -> !occupiedKartIds.contains(kart.getId()))
                .map(this::mapKartToKartResponseDTO)
                .collect(Collectors.toList());
    }

    private KartResponseDTO mapKartToKartResponseDTO(Kart kart) {
        return new KartResponseDTO(
                kart.getId(),
                kart.getKartNumber(),
                kart.getModel(),
                kart.getIsAvailable(),
                kart.getTrack().getId(),
                kart.getTrack().getName()
        );
    }
}