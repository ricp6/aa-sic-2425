export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONCLUDED = 'CONCLUDED'

}
export interface Session {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Participant {
  id: number;
  userId: number;
  userName: string;
  kartId: number;
  kartNumber: number;
}

export interface ReservationDetails {
  id: number;
  reservationDate: string;
  status: ReservationStatus;
  trackId: number;
  trackName: string;
  sessions: Session[];
  participants: Participant[];
}
