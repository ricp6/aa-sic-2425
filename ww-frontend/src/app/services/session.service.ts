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
      catchError(this.handleError('loading the sessions'))
    );
  }

  getSessionDetails(sessionId: number): Observable<SessionDetails> {
    return this.http.get<SessionDetails>(`${this.sessionsURL}/${sessionId}`).pipe(
      catchError(this.handleError('loading the details of the session'))
    );
  }

  startSession(sessionId: number): Observable<string> {
    return this.http.post(`${this.sessionsURL}/${sessionId}/start`, {}, { responseType: 'text' }).pipe(
      catchError(this.handleError('starting the session'))
    );
  }

  endSession(sessionId: number): Observable<string> {
    return this.http.post(`${this.sessionsURL}/${sessionId}/end`, {}, { responseType: 'text' }).pipe(
      catchError(this.handleError('ending the session'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
      } else if (error.status === 403) {
        this.toastr.warning('You don’t have permission to execute this action', 'Permission required');
      } else {
        this.toastr.error(`An error occurred while ${operation}`, 'Server error');
      }
      return throwError(() => error);
    };
  }
}
