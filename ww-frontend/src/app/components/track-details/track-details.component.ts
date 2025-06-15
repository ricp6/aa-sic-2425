import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackDetails } from '../../interfaces/track'
import { TrackService } from '../../services/track.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ViewService } from '../../services/view.service';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from '../../interfaces/reservation';
import { ReservationService } from '../../services/reservation.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { format } from 'date-fns';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {
  
  isEnterpriseView: boolean = false;
  track!: TrackDetails;

  trackActiveReservations: Reservation[] | null = null;
  trackConcludedReservations: Reservation[] | null = null;
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user(): User | null {
    return this.authService.getCurrentUser();
  }
  
  get isFav(): boolean {
    return this.userService.isFavorite(this.track.id);
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly viewService: ViewService,
    private readonly trackService: TrackService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reservationService: ReservationService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.goBack();
      return;
    }

    this.trackService.getTrackDetails(id).subscribe({
      next: (track) => {
        this.track = track;
      },
      error: () => {
        // Optionally show a toast or redirect
        this.goBack();
      }
    });
  }

  setFav(): void {
    if (!this.isFav) {
      this.userService.addFavorite(this.track.id).subscribe();
    } else {
      this.userService.removeFavorite(this.track.id).subscribe();
    }
  }

  toggleOperational(): void {
    const newStatus = !this.track.isAvailable;

    this.trackService.setOperationalState(this.track.id).subscribe({
      next: () => {
        this.track.isAvailable = newStatus;
        this.toastr.success(`Track marked as ${newStatus ? 'operational' : 'not operational'}`);
      },
      error: () => this.toastr.error('Failed to change operational status')
    });
  }

  goBack() {
    this.location.back();
  }

  goToCreateReservation(): void {
    const nextRoute = this.isEnterpriseView ? 'enterprise/reservations/form' : 'reservations/form';
    this.router.navigate([nextRoute], {
      state: { trackId: this.track.id }
    })
  }

  // Load the reservations only when is needed
  onTabChange(event: MatTabChangeEvent): void {
    const label = event.tab.textLabel;

    if (label === 'Active Reservations' && this.trackActiveReservations === null) {
      this.reservationService.getTrackActiveReservations(this.track.id).subscribe({
        next: res => this.trackActiveReservations = res,
        error: err => console.error('Failed to load active reservations', err)
      });
    }

    if (label === 'Completed Reservations' && this.trackConcludedReservations === null) {
      this.reservationService.getTrackConcludedReservations(this.track.id).subscribe({
        next: res => this.trackConcludedReservations = res,
        error: err => console.error('Failed to load completed reservations', err)
      });
    }
  }

  get todayActiveReservations(): Reservation[] {
    if(!this.trackActiveReservations) {
      return [];
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    return this.trackActiveReservations.filter(res => {
      const reservationDate = new Date(res.reservationDate);
      reservationDate.setHours(12, 0, 0, 0);

      return reservationDate.getTime() === today.getTime();
    });
  }

  get futureActiveReservations(): Reservation[] {
    if(!this.trackActiveReservations) {
      return [];
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    return this.trackActiveReservations.filter(res => {
      const reservationDate = new Date(res.reservationDate);
      reservationDate.setHours(12, 0, 0, 0);

      return reservationDate.getTime() > today.getTime();
    });
  }

  formatTime(timeString: string): string {
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  formatDate(date: string): string {
    return format(date, 'yyyy-MM-dd');
  }
}
