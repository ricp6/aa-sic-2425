import { Component, Input } from '@angular/core';
import { Reservation } from '../../interfaces/reservation';
import { format } from 'date-fns';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss']
})
export class ReservationCardComponent {
  
  @Input() reservation!: Reservation;
  @Input() isEnterpriseView!: boolean;

  get formatedDate(): string {
    return format(this.reservation.reservationDate, 'yyyy-MM-dd');
  }
}
