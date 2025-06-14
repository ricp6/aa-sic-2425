package pt.um.aasic.whackywheels.dtos.reservation;

import pt.um.aasic.whackywheels.dtos.participant.ParticipantUpdateDTO;
import pt.um.aasic.whackywheels.dtos.session.SessionCreateDTO;

import java.time.LocalDate;
import java.util.Set;

public class ReservationUpdateRequestDTO {

    private LocalDate reservationDate;
    private Set<SessionCreateDTO> sessions;
    private Set<ParticipantUpdateDTO> participants;

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }

    public Set<SessionCreateDTO> getSessions() {
        return sessions;
    }

    public void setSessions(Set<SessionCreateDTO> sessions) {
        this.sessions = sessions;
    }

    public Set<ParticipantUpdateDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<ParticipantUpdateDTO> participants) {
        this.participants = participants;
    }
}