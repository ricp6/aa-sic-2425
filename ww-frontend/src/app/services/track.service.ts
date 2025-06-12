import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap, catchError, throwError, BehaviorSubject, of, combineLatest, map } from 'rxjs';
import { RecordsDTO, SimpleTrack, TrackDetails, TrackWithRecords } from '../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly tracksURL = "http://localhost:8080/api/tracks";

  private tracksCache: SimpleTrack[] | null = null;
  private readonly tracksSubject = new BehaviorSubject<SimpleTrack[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}

  private getTracksBackend(): Observable<SimpleTrack[]> {
    if (this.tracksCache) {
      return of(this.tracksCache);
    }
    return this.http.get<SimpleTrack[]>(this.tracksURL).pipe(
      tap(tracks => {
        this.tracksCache = tracks;
        this.tracksSubject.next(tracks);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If you see 401 here, it means:
          // 1. No refresh token existed.
          // 2. Refresh failed.
          // 3. Refresh succeeded, but the retried request *still* got 401.
          // In all these cases, the user should already be logged out by the interceptor/auth service.
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
          // You might not even need specific logout here, as the interceptor or authService will do it.
          // The main goal here is to inform the user.
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while loading the tracks', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  getTracksCached(): Observable<SimpleTrack[]> {
    if (this.tracksCache) {
      return of(this.tracksCache);
    }
    return this.tracksSubject.asObservable();
  }

  // Optionally, add a method to force refresh
  refreshTracks(): Observable<SimpleTrack[]> {
    this.tracksCache = null;
    return this.getTracksBackend();
  }
  
  private getTracksRecords(): Observable<RecordsDTO[] | null> {
    return this.http.get<RecordsDTO[]>(this.tracksURL + '/records').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If you see 401 here, it means:
          // 1. No refresh token existed.
          // 2. Refresh failed.
          // 3. Refresh succeeded, but the retried request *still* got 401.
          // In all these cases, the user should already be logged out by the interceptor/auth service.
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
          // You might not even need specific logout here, as the interceptor or authService will do it.
          // The main goal here is to inform the user.
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while loading the tracks records', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  getTracksWithRecords(): Observable<TrackWithRecords[]> {
    return combineLatest([
      this.getTracksCached(),
      this.getTracksRecords()
    ]).pipe(
      map(([tracks, records]) => {
        const recordsMap = new Map(records?.map(r => [r.id, r]) ?? []);
        return (tracks ?? [])
          .map(track => ({
            ...track,
            personalRecord: recordsMap.get(track.id)?.personalRecord ?? null,
            trackRecord: recordsMap.get(track.id)?.trackRecord ?? null
          }));
      }),
      catchError((err) => {
        console.error("Failed to load tracks or records", err);
        return of([]); // fallback to empty array on error
      })
    );
  }

  // Update the return type to Observable<TrackDetails>
  getTrack(id: number): Observable<TrackDetails> {
    return this.http.get<TrackDetails>(`${this.tracksURL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If you see 401 here, it means:
          // 1. No refresh token existed.
          // 2. Refresh failed.
          // 3. Refresh succeeded, but the retried request *still* got 401.
          // In all these cases, the user should already be logged out by the interceptor/auth service.
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
          // You might not even need specific logout here, as the interceptor or authService will do it.
          // The main goal here is to inform the user.
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while loading the track details', 'Server error');
        }
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
