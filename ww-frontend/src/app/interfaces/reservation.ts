
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
  numberOfSlots: string;
  status: ReservationStatus;
  trackImage: string;
}
