import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationStatus } from '../../interfaces/reservation';
import { ReservationService } from '../../services/reservation.service';
import { ViewService } from '../../services/view.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  
  isEnterpriseView: boolean = false;

  private reservationsSubscription: Subscription | undefined;
  activeReservations: Reservation[] = [];
  completedReservations: Reservation[] = [];

  constructor(
    private readonly viewService: ViewService,
    private readonly reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    this.loadReservations();
  }

  ngOnDestroy(): void {
    if (this.reservationsSubscription) {
      this.reservationsSubscription.unsubscribe();
    }
  }

  loadReservations(): void {
    let reservationsObservable: Observable<Reservation[]>;
    if (this.isEnterpriseView) {
      // Owner, get reservations on his tracks
      // TODO change this later 
      reservationsObservable = this.reservationService.getUserReservations();
    } else {
      // User, get reservations where he participated
      reservationsObservable = this.reservationService.getUserReservations();
    }
    
    this.reservationsSubscription = reservationsObservable.subscribe({
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
    today.setHours(0, 0, 0, 0);

    return this.activeReservations.filter(res => {
      const [day, month, year] = res.date.split('/').map(Number);
      const reservationDate = new Date(year, month - 1, day);
      reservationDate.setHours(0, 0, 0, 0);

      return reservationDate.getTime() === today.getTime();
    });
  }

  get futureActiveReservations(): Reservation[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.activeReservations.filter(res => {
      const [day, month, year] = res.date.split('/').map(Number);
      const reservationDate = new Date(year, month - 1, day);
      reservationDate.setHours(0, 0, 0, 0);

      return reservationDate.getTime() > today.getTime();
    });
  }
}
