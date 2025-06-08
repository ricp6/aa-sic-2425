import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap, catchError, throwError, BehaviorSubject, of } from 'rxjs';
import { Records, SimpleTrack, TrackDetails } from '../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly tracksURL = "http://localhost:8080/api/tracks";

  private tracksCache: SimpleTrack[] | null = null;
  private readonly tracksSubject = new BehaviorSubject<SimpleTrack[] | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}

  loadTracks(): Observable<SimpleTrack[]> {
    if (this.tracksCache) {
      return of(this.tracksCache);
    }
    return this.http.get<SimpleTrack[]>(this.tracksURL).pipe(
      tap(tracks => {
        this.tracksCache = tracks;
        this.tracksSubject.next(tracks);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getAll(): Observable<SimpleTrack[] | null> {
    if (this.tracksCache) {
      return of(this.tracksCache);
    }
    return this.tracksSubject.asObservable();
  }

  // Optionally, add a method to force refresh
  refreshTracks(): Observable<SimpleTrack[]> {
    this.tracksCache = null;
    return this.loadTracks();
  }
  
  getTracksRecords(): Observable<Records[] | null> {
    return this.http.get<Records[]>(this.tracksURL + '/records').pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Update the return type to Observable<TrackDetails>
  getTrack(id: number): Observable<TrackDetails> {
      return this.http.get<TrackDetails>(`${this.tracksURL}/${id}`).pipe(
          catchError((error: HttpErrorResponse) => {
              console.error(`Error fetching track details for ID ${id}:`, error);
              // Optionally, show a user-friendly toast/message here
              // this.toastr.error('Failed to load track details.', 'Error');
              return throwError(() => new Error(`Something went wrong fetching track: ${error.message}`));
          })
      );
  }

  /*createTrack(data: { track: Track }) {
    return this.http.post<Track>(this.tracksURL, data).pipe(
      tap(() => {
        this.toastr.success('Your track was successfully created!', 'Start racing!');
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toastr.warning(error.error ?? 'Invalid data given.', 'Track creation error');
        } else if(error.status === 403) {
          this.toastr.error(error.error ?? 'You need permission to access this page.', 'No permission');
        } else {
          this.toastr.error('An error occurred while processing the registration.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }*/
}
