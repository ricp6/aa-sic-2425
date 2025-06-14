import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { SessionDetail, Classification, User, Kart, Participant, PodiumEntry } from '../interfaces/session-details';
import { Session, SessionDetails } from '../interfaces/session';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private MOCK_USERS: User[] = [
    { id: 1, name: 'Ricardo Champion', profilePic: 'track1.jpg' },
    { id: 2, name: 'Leiras Toplaner', profilePic: 'track2.jpg' },
    { id: 3, name: 'Luka El Bicho', profilePic: 'track3.jpeg' },
    { id: 4, name: 'Pepe Wine Tester', profilePic: 'assets/profile-pics/pepe.png' },
    { id: 5, name: 'Don Don Don', profilePic: 'assets/profile-pics/don.png' }
  ];

  private MOCK_KARTS: Kart[] = [
    { id: 1, number: 'Kart 1' },
    { id: 2, number: 'Kart 2' },
    { id: 3, number: 'Kart 3' },
    { id: 4, number: 'Kart 4' },
    { id: 5, number: 'Kart 5' },
    { id: 6, number: 'Kart 6' },
    { id: 7, number: 'Kart 7' },
  ];

  private MOCK_PARTICIPANTS: Participant[] = [
    { id: 1, user: this.MOCK_USERS[0], kart: this.MOCK_KARTS[5] },
    { id: 2, user: this.MOCK_USERS[1], kart: this.MOCK_KARTS[3] },
    { id: 3, user: this.MOCK_USERS[2], kart: this.MOCK_KARTS[6] },
    { id: 4, user: this.MOCK_USERS[3], kart: this.MOCK_KARTS[5] },
    { id: 5, user: this.MOCK_USERS[4], kart: this.MOCK_KARTS[2] }
  ];

  private MOCK_CLASSIFICATIONS: Classification[] = [
    { id: 1, position: 1, averageTime: '10', bestLapTime: '0:21.201', participant: this.MOCK_PARTICIPANTS[0] },
    { id: 2, position: 2, averageTime: '9', bestLapTime: '0:21.552', participant: this.MOCK_PARTICIPANTS[1] },
    { id: 3, position: 3, averageTime: '9', bestLapTime: '0:22.001', participant: this.MOCK_PARTICIPANTS[2] },
    { id: 4, position: 4, averageTime: '8', bestLapTime: '0:23.435', participant: this.MOCK_PARTICIPANTS[3] },
    { id: 5, position: 5, averageTime: '7', bestLapTime: '0:23.763', participant: this.MOCK_PARTICIPANTS[4] }
  ];

  private MOCK_SESSION_DETAIL: SessionDetail = {
    id: 1,
    trackId: 1,
    date: '07/04/2025',
    startTime: '14:00',
    endTime: '14:22',
    kartsUsed: 6,
    totalCost: 125,
    classifications: this.MOCK_CLASSIFICATIONS
  };

  
  getSession(id: number): Observable<SessionDetail> {
    return of(this.MOCK_SESSION_DETAIL);
  }
  
  
  getPodiumEntries(classifications: Classification[]): PodiumEntry[] {
    return classifications
    .sort((a, b) => a.position - b.position)
    .slice(0, 3)
    .map(c => ({
      position: c.position,
      driverName: c.participant.user.name,
      profilePic: c.participant.user.profilePic || 'default.png'
    }));
  }

  
  private readonly sessionsURL = "http://localhost:8080/api/sessions";

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) { }
  
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.sessionsURL}`).pipe(
      catchError(this.handleError('loading the sessions'))
    );
  }

  getSessionDetails(sessionId: number): Observable<SessionDetails[]> {
    return this.http.get<SessionDetails[]>(`${this.sessionsURL}/${sessionId}`).pipe(
      catchError(this.handleError('loading the details of the session'))
    );
  }

  startSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.sessionsURL}/${sessionId}/start`, {}).pipe(
      catchError(this.handleError('starting the session'))
    );
  }

  endSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.sessionsURL}/${sessionId}/end`, {}).pipe(
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
