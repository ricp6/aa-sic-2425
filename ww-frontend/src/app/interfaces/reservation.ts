export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONCLUDED = 'CONCLUDED',
  CANCELLED = 'CANCELLED'
}

export interface Reservation {
  id: number;
  trackName: string;
  numParticipants: number;
  date: string;
  numSessions: number;
  status: ReservationStatus;
  trackImage: string;
}

interface SimpleSession {
  id: number;
  startTime: string;
  endTime: string;
}

interface SimpleParticipant {
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
  price: number;
  trackId: number;
  trackName: string;
  sessions: SimpleSession[];
  participants: SimpleParticipant[];
}
