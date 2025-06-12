import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reservation, ReservationStatus } from '../interfaces/reservation';
import { ReservationDetails, Session, Participant } from '../interfaces/reservation-details';
import { Slot } from '../interfaces/slot';


interface RawReservation {
  id: number;
  reservationDate: string;
  status: string;
  trackName: string;
  numSessions: number;
  numParticipants: number;
  trackImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsURL = 'http://localhost:8080/api/reservations';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) { }

  getReservations(): Observable<Reservation[]> {
    return this.getRawReservations().pipe(
      map(rawReservations => {
        const mappedReservations = this.mapRawReservationsToReservations(rawReservations);

        mappedReservations.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);

          const [dayB, monthB, yearB] = b.date.split('/').map(Number);
          const dateB = new Date(yearB, monthB - 1, dayB);

          return dateA.getTime() - dateB.getTime();
        });

        return mappedReservations;
      }),
      catchError(this.handleError)
    );
  }

  private mapRawReservationsToReservations(rawReservations: RawReservation[]): Reservation[] {
    return rawReservations.map(raw => {
      const reservationDate = new Date(raw.reservationDate);
      const date = reservationDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

      return {
        id: raw.id,
        trackName: raw.trackName,
        numberOfParticipants: raw.numParticipants,
        date: date,
        numberOfSlots: raw.numSessions.toString(),
        status: raw.status as ReservationStatus,
        trackImage: raw.trackImage
      };
    });
  }

  private getRawReservations(): Observable<RawReservation[]> {
    return this.http.get<RawReservation[]>(`${this.reservationsURL}`).pipe(
      catchError(this.handleError)
    );
  }

  getSlots(trackId: number, date: string): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.reservationsURL}/slots/${trackId}/${date}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("erro obter slots")
        console.error(error)
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while loading the slots for this day', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  createReservation(reservationCreateDTO: any): Observable<RawReservation> {
    return this.http.post<RawReservation>(`${this.reservationsURL}/create`, reservationCreateDTO).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("error create reservation")
        console.error(error)
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while creating the reservation', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  getReservationDetails(id: number): Observable<ReservationDetails> {
    return this.http.get<ReservationDetails>(`${this.reservationsURL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.reservationsURL}/${id}`).pipe(
      map(() => {
        this.toastr.success('Reservation cancelled successfully.', 'Success');
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
    } else if (error.status === 403) {
      this.toastr.warning('You don\'t have permission to perform this action', 'Permission required');
    } else {
      this.toastr.error('An error occurred while loading reservations', 'Server error');
    }
    return throwError(() => error);
  }
}
