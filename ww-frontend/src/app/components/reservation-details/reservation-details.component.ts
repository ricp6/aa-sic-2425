import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ViewService } from '../../services/view.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDetails, ReservationStatus, SimpleSession } from '../../interfaces/reservation';
import { SessionService } from '../../services/session.service';
import { format } from 'date-fns';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  
  isEnterpriseView: boolean = false;

  reservation!: ReservationDetails;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly reservationService: ReservationService,
    private readonly sessionService: SessionService,
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
        this.loadReservationDetails(+idParam);
      } else {
        console.error('Reservation ID not provided in route.');
        this.toastr.error("Please navigate using the page commands.", "Invalid URL!");
        this.goBack();
      }
    });
  }

  loadReservationDetails(id: number): void {
    this.reservationService.getReservationDetails(id).subscribe({
      next: (reservation: ReservationDetails) => {
        reservation.sessions.sort((a, b) => a.bookedStartTime.localeCompare(b.bookedStartTime));
        this.reservation = reservation;
      },
      error: (err) => {
        console.error('Error fetching reservation details:', err);
        this.goBack();
      }
    });
  }

  formatDate(dateTimeString: string): string {
    return format(dateTimeString, 'yyyy-MM-dd');
  }

  formatTime(timeString: string): string {
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  isActive(): boolean {
    return this.reservation?.status === ReservationStatus.PENDING 
        || this.reservation?.status === ReservationStatus.ACCEPTED;
  }

  isCreator(): boolean {
    return this.authService.getCurrentUser()?.id === this.reservation.creatorId;
  }

  canStartSession(session: SimpleSession): boolean {
    return this.reservation?.status === ReservationStatus.ACCEPTED 
        && !this.isOpen(session) && this.isInTimeWindow(session);
  }

  isOpen(session: SimpleSession): boolean {
    return this.hasStarted(session) && !this.hasEnded(session);
  }

  hasStarted(session: SimpleSession): boolean {
    return session.realStartTime != null;
  }

  hasEnded(session: SimpleSession): boolean {
    return session.realEndTime != null;
  }

  isInTimeWindow(session: SimpleSession): boolean {
    const now = new Date();
    // Gets session times as dates
    const sessionStart = new Date(`${this.reservation.reservationDate}T${session.bookedStartTime}`);
    const sessionEnd = new Date(`${this.reservation.reservationDate}T${session.bookedEndTime}`);

    return sessionStart <= now && now <= sessionEnd;
  }

  startSession(sessionId: number): void {
    this.sessionService.startSession(sessionId).subscribe({
      next: () => {
        this.toastr.success('Session started.', 'Success');
        this.loadReservationDetails(this.reservation.id);
      },
      error: () => this.toastr.error('Failed to start session.', 'Error')
    });
  }

  endSession(sessionId: number): void {
    this.sessionService.endSession(sessionId).subscribe({
      next: () => {
        this.toastr.success('Session finished.', 'Success');
        this.loadReservationDetails(this.reservation.id);
      },
      error: () => this.toastr.error('Failed to end session.', 'Error')
    });
  }


  // TODO Change when edit is implemented
  editReservation(): void {
    // this.router.navigate(['/reservations/edit', this.reservationId]);
    console.log("Method not implemented: edit reservation");
  }

  cancelReservation(): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.reservationService.cancelReservation(this.reservation.id).subscribe({
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
      if (message != null) {
        this.reservationService.acceptReservation(this.reservation.id, message).subscribe({
          next: () => {
            this.toastr.success('Reservation accepted.', 'Success');
            this.loadReservationDetails(this.reservation.id);
          },
          error: () => this.toastr.error('Failed to accept reservation.', 'Error')
        });
      }
    });
  }

  rejectReservation(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
        title: 'Reject Reservation',
        defaultMessage: 'Unfortunately, your reservation could not be accepted.'
      }
    });
    
    dialogRef.afterClosed().subscribe(message => {
      // Confirm one more time because it is irreversible
      if (message != null && confirm('Are you sure you want to reject this reservation?')) {
        this.reservationService.rejectReservation(this.reservation.id, message).subscribe({
          next: () => {
            this.toastr.success('Reservation rejected.', 'Success');
            this.router.navigate(['/enterprise/reservations']);
          },
          error: () => this.toastr.error('Failed to reject reservation.', 'Error')
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToCreateReservation(): void {
    const nextRoute = this.isEnterpriseView ? 'enterprise/reservations/form' : 'reservations/form';
    this.router.navigate([nextRoute], {
      state: { trackId: this.reservation.trackId }
    })
  }
}
