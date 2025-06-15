import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Session, SessionDetails } from '../interfaces/session';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private readonly sessionsURL = "http://localhost/api/sessions";

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) { }
  
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.sessionsURL}`).pipe(
      catchError(this.handleError())
    );
  }

  getSessionDetails(sessionId: number): Observable<SessionDetails> {
    return this.http.get<SessionDetails>(`${this.sessionsURL}/${sessionId}`).pipe(
      catchError(this.handleError())
    );
  }

  startSession(sessionId: number): Observable<string> {
    return this.http.post(`${this.sessionsURL}/${sessionId}/start`, {}, { responseType: 'text' }).pipe(
      catchError(this.handleError())
    );
  }

  endSession(sessionId: number): Observable<string> {
    return this.http.post(`${this.sessionsURL}/${sessionId}/end`, {}, { responseType: 'text' }).pipe(
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
