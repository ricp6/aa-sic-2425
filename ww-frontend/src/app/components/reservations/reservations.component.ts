import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationStatus } from '../../interfaces/reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  activeReservations: Reservation[] = [];
  completedReservations: Reservation[] = [];

  constructor(
    private readonly reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getUserReservations().subscribe({
      next: (reservations: Reservation[]) => {
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        this.activeReservations = reservations.filter(res => {
          const [day, month, year] = res.date.split('/').map(Number);
          const reservationDate = new Date(year, month - 1, day);
          reservationDate.setHours(12, 0, 0, 0)

          return (res.status === ReservationStatus.PENDING || res.status === ReservationStatus.ACCEPTED) &&
            reservationDate.getTime() >= today.getTime();
        });

        this.completedReservations = reservations.filter(res =>
          res.status === ReservationStatus.REJECTED || res.status === ReservationStatus.CONCLUDED || res.status === ReservationStatus.CANCELLED
        );
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
      }
    });
  }

  get todayActiveReservations(): Reservation[] {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    return this.activeReservations.filter(res => {
      const [day, month, year] = res.date.split('/').map(Number);
      const reservationDate = new Date(year, month - 1, day);
      reservationDate.setHours(12, 0, 0, 0);

      return reservationDate.getTime() === today.getTime();
    });
  }

  get futureActiveReservations(): Reservation[] {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    return this.activeReservations.filter(res => {
      const [day, month, year] = res.date.split('/').map(Number);
      const reservationDate = new Date(year, month - 1, day);
      reservationDate.setHours(12, 0, 0, 0);

      return reservationDate.getTime() > today.getTime();
    });
  }
}
