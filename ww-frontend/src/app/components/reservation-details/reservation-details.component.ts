import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { ReservationDetails, ReservationStatus } from '../../interfaces/reservation-details';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: ReservationDetails | undefined;
  reservationId: number | undefined;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly reservationService: ReservationService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.reservationId = +idParam;
        this.loadReservationDetails(this.reservationId);
      } else {
        console.error('Reservation ID not provided in route.');
        this.router.navigate(['/reservations']);
      }
    });
  }

  loadReservationDetails(id: number): void {
    this.reservationService.getReservationDetails(id).subscribe({
      next: (data: ReservationDetails) => {
        this.reservation = data;
      },
      error: (err) => {
        console.error('Error fetching reservation details:', err);
        this.router.navigate(['/reservations']);
      }
    });
  }

  formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatTime(timeString: string): string {
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  isActive(): boolean {
    return this.reservation?.status === ReservationStatus.ACCEPTED 
        || this.reservation?.status === ReservationStatus.PENDING;
  }

  // TODO Alterar para qnd tiver as sessoes
  navigateToSessionDetails(sessionId: number): void {
    this.router.navigate(['/sessions', sessionId]);
    console.log(`Navigating to session ${sessionId} details.`);
  }

  // TODO Change when edit is implemented
  editReservation(): void {
    if (this.reservationId) {
      // this.router.navigate(['/reservations/edit', this.reservationId]);
      console.log("Method not implemented: edit reservation");
    }
  }

  cancelReservation(): void {
    if (this.reservationId && confirm('Are you sure you want to cancel this reservation?')) {
      this.reservationService.cancelReservation(this.reservationId).subscribe({
        next: () => {
          this.toastr.success('Reservation cancelled successfully.', 'Success');
          this.router.navigate(['/reservations']);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
