import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reservation, ReservationDetails } from '../interfaces/reservation';
import { Slot } from '../interfaces/slot';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsURL = 'http://localhost/api/reservations';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) { }

  private fetchReservations(endpoint: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.reservationsURL}${endpoint}`).pipe();
  }

  getUserReservations(): Observable<Reservation[]> {
    return this.loadAndMapReservations(this.fetchReservations(''));
  }

  getTrackActiveReservations(trackId: number): Observable<Reservation[]> {
    return this.loadAndMapReservations(this.fetchReservations(`/track/active/${trackId}`));
  }

  getTrackConcludedReservations(trackId: number): Observable<Reservation[]> {
    return this.loadAndMapReservations(this.fetchReservations(`/track/concluded/${trackId}`));
  }

  private loadAndMapReservations(source$: Observable<Reservation[]>): Observable<Reservation[]> {
    return source$.pipe(
      map(reservations => reservations
        .map(reservation => ({
          ...reservation,
          reservationDate: format(reservation.reservationDate, 'yyyy-MM-dd')
        }))
        .sort((a, b) => a.reservationDate.localeCompare(b.reservationDate))
      ),
      catchError(this.handleError())
    );
  }

  getSlots(trackId: number, date: string): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.reservationsURL}/slots/${trackId}/${date}`).pipe(
      catchError(this.handleError())
    );
  }

  createReservation(reservationCreateDTO: any): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.reservationsURL}/create`, reservationCreateDTO).pipe(
      catchError(this.handleError())
    );
  }

  getReservationDetails(id: number): Observable<ReservationDetails> {
    return this.http.get<ReservationDetails>(`${this.reservationsURL}/${id}`).pipe(
      catchError(this.handleError())
    );
  }

  cancelReservation(id: number): Observable<string> {
    return this.http.put(`${this.reservationsURL}/cancel/${id}`, {}, { responseType: 'text' }).pipe(
      catchError(this.handleError())
    );
  }

  acceptReservation(id: number, message: string): Observable<string> {
    return this.http.put(`${this.reservationsURL}/accept/${id}`, { message }, { responseType: 'text' }).pipe(
      catchError(this.handleError())
    );
  }

  rejectReservation(id: number, message: string): Observable<string> {
    return this.http.put(`${this.reservationsURL}/reject/${id}`, { message }, { responseType: 'text' }).pipe(
      catchError(this.handleError())
    );
  }

  private handleError() {
    return (error: HttpErrorResponse): Observable<never> => {
      // console.error(error)
      if (error.status === 400) {
        this.toastr.warning(error.message, 'Invalid data!');
      } else if (error.status === 401) {
        this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
      } else if (error.status === 403) {
        this.toastr.warning('You dont have permission to execute this action', 'Permission required');
      } else {
        this.toastr.error('An unexpected error occurred while loading some necessary data', 'Server error');
      }
      return throwError(() => error);
    }
  }
}
