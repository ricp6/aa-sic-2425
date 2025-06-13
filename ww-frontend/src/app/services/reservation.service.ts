import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reservation, ReservationStatus } from '../interfaces/reservation';
import { ReservationDetails } from '../interfaces/reservation-details';
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
    private readonly toastr: ToastrService
  ) { }

  getUserReservations(): Observable<Reservation[]> {
    return this.loadAndMapReservations(this.getUserRawReservations());
  }

  getTrackActiveReservations(): Observable<Reservation[]> {
    return this.getUserReservations();
    // return this.loadAndMapReservations(this.getTrackActiveRawReservations());
  }

  getTrackConcludedReservations(): Observable<Reservation[]> {
    return this.getUserReservations();
    // return this.loadAndMapReservations(this.getTrackConcludedRawReservations());
  }

  private loadAndMapReservations(source$: Observable<RawReservation[]>): Observable<Reservation[]> {
    return source$.pipe(
      map(rawReservations => {
        const mappedReservations = this.mapRawReservationsToReservations(rawReservations);
        return mappedReservations.sort((a, b) => {
          const dateA = this.parseDate(a.date);
          const dateB = this.parseDate(b.date);
          return dateA.getTime() - dateB.getTime();
        });
      }),
      catchError(this.handleError)
    );
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  private mapRawReservationsToReservations(rawReservations: RawReservation[]): Reservation[] {
    return rawReservations.map(raw => {
      const reservationDate = new Date(raw.reservationDate);
      const date = reservationDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

      return {
        id: raw.id,
        trackName: raw.trackName,
        numParticipants: raw.numParticipants,
        date: date,
        numSessions: raw.numSessions,
        status: raw.status as ReservationStatus,
        trackImage: raw.trackImage
      };
    });
  }

  private getUserRawReservations(): Observable<RawReservation[]> {
    return this.http.get<RawReservation[]>(`${this.reservationsURL}`).pipe(
      catchError(this.handleError)
    );
  }

  private getTrackActiveRawReservations(trackId: number): Observable<RawReservation[]> {
    return this.http.get<RawReservation[]>(`${this.reservationsURL}/track/active/${trackId}`).pipe(
      catchError(this.handleError)
    );
  }

  private getTrackConcludedRawReservations(trackId: number): Observable<RawReservation[]> {
    return this.http.get<RawReservation[]>(`${this.reservationsURL}/track/concluded/${trackId}`).pipe(
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

  cancelReservation(id: number): Observable<string> {
    return this.http.put(`${this.reservationsURL}/cancel/${id}`, {}, { responseType: 'text' }).pipe(
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
