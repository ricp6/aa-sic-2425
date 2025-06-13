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
