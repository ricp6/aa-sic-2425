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
  reservationDate: string;
  numSessions: number;
  status: ReservationStatus;
  trackImage: string;
}

export interface SimpleSession {
  id: number;
  bookedStartTime: string;
  bookedEndTime: string;
  realStartTime: string;
  realEndTime: string;
}

export interface SimpleParticipant {
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
  creatorId: number;
  sessions: SimpleSession[];
  participants: SimpleParticipant[];
}
