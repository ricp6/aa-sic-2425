import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ViewService } from '../../services/view.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDetails, ReservationStatus } from '../../interfaces/reservation';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  
  isEnterpriseView: boolean = false;

  reservation: ReservationDetails | undefined;
  reservationId!: number;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly reservationService: ReservationService,
    private readonly viewService: ViewService,
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.reservationId = +idParam;
        this.loadReservationDetails(this.reservationId);
      } else {
        console.error('Reservation ID not provided in route.');
        this.goBack();
      }
    });
  }

  loadReservationDetails(id: number): void {
    this.reservationService.getReservationDetails(id).subscribe({
      next: (reservation: ReservationDetails) => {
        this.reservation = reservation;
      },
      error: (err) => {
        console.error('Error fetching reservation details:', err);
        this.goBack();
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
    return this.reservation?.status === ReservationStatus.PENDING ||
      (!this.isEnterpriseView && this.reservation?.status === ReservationStatus.ACCEPTED);
  }

  // TODO Alterar para qnd tiver as sessoes
  navigateToSessionDetails(sessionId: number): void {
    this.router.navigate(['/sessions', sessionId]);
    console.log(`Navigating to session ${sessionId} details.`);
  }

  // TODO Change when edit is implemented
  editReservation(): void {
    // this.router.navigate(['/reservations/edit', this.reservationId]);
    console.log("Method not implemented: edit reservation");
  }

  cancelReservation(): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.reservationService.cancelReservation(this.reservationId).subscribe({
        next: () => {
          this.toastr.success('Reservation cancelled successfully.', 'Success');
          this.router.navigate(['/reservations']);
        }
      });
    }
  }

  acceptReservation(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
        title: 'Accept Reservation',
        defaultMessage: 'Your reservation has been accepted.'
      }
    });
    
    dialogRef.afterClosed().subscribe(message => {
      this.reservationService.acceptReservation(this.reservationId, message ?? '').subscribe({
        next: () => {
          this.toastr.success('Reservation accepted.', 'Success');
          this.loadReservationDetails(this.reservationId);
        },
        error: () => this.toastr.error('Failed to accept reservation.', 'Error')
      });
    });
  }

  rejectReservation(): void {
    if (confirm('Are you sure you want to reject this reservation?')) {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '400px',
        data: {
          title: 'Reject Reservation',
          defaultMessage: 'Unfortunately, your reservation could not be accepted.'
        }
      });

      dialogRef.afterClosed().subscribe(message => {
        this.reservationService.rejectReservation(this.reservationId, message).subscribe({
          next: () => {
            this.toastr.success('Reservation rejected.', 'Success');
            this.router.navigate(['/enterprise/reservations']);
          },
          error: () => this.toastr.error('Failed to reject reservation.', 'Error')
        });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
