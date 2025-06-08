
export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONCLUDED = 'CONCLUDED'
}

export interface Reservation {
  id: number;
  trackName: string;
  numberOfParticipants: number;
  date: string;
  time: string;
  status: ReservationStatus;
  trackImage: string;
}
