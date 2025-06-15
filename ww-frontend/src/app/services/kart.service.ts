import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { Kart } from '../interfaces/kart';

@Injectable({
  providedIn: 'root'
})
export class KartService {
  private readonly kartsURL = 'http://localhost/api/karts';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) { }

  getKartsAvailable(trackId: number): Observable<Kart[]> {
    return this.http.get<Kart[]>(`${this.kartsURL}/available/${trackId}`).pipe(
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
