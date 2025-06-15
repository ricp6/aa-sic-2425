import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap, catchError, throwError, BehaviorSubject, of, combineLatest, map } from 'rxjs';
import { RecordsDTO, SimpleTrack, TrackDetails, TrackWithRecords, FilterDTO } from '../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly tracksURL = "http://localhost/api/tracks";

  private tracksCache: SimpleTrack[] | null = null;
  private readonly tracksSubject = new BehaviorSubject<SimpleTrack[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}

  // Endpoint to fetch all tracks from the backend
  refreshTracks(): Observable<SimpleTrack[]> {
    this.tracksCache = null;
    return this.getTracksBackend();
  }

  // Gets the cached tracks to avoid multiple requests on info that rarely changes
  getTracksCached(): Observable<SimpleTrack[]> {
    if (this.tracksCache) {
      return of(this.tracksCache);
    }
    return this.tracksSubject.asObservable();
  }
  
  // Fetches the track records and joins with cached tracks
  getTracksWithRecords(): Observable<TrackWithRecords[]> {
    return combineLatest([
      this.getTracksCached(),
      this.getTracksRecords()
    ]).pipe(
      map(([tracks, records]) => {
        const recordsMap = new Map(records?.map(r => [r.id, r]) ?? []);
        return (tracks ?? [])
          .map(track => {
            const trackRecords = recordsMap.get(track.id);
            return {
              ...track,
              personalRecord: trackRecords?.personalRecord ?? null,
              trackRecord: trackRecords?.trackRecord ?? null,
            };
          });
      }),
      catchError((err) => {
        // console.error("Failed to load tracks or records", err)
        return of([]);
      })
    );
  }

  // Fetches only the owned tracks
  getOwnedTracks(): Observable<SimpleTrack[]> {
    return this.http.get<SimpleTrack[]>(`${this.tracksURL}/owned`).pipe(
      catchError(this.handleError())
    );
  }
  
  // Fetches the track details
  getTrackDetails(id: number): Observable<TrackDetails> {
    return this.http.get<TrackDetails>(`${this.tracksURL}/${id}`).pipe(
      catchError(this.handleError())
    );
  }

  // Changes the availability of the track
  setOperationalState(trackId: number): Observable<void> {
    return this.http.put<void>(`${this.tracksURL}/changeAvailability/${trackId}`, {}).pipe(
      catchError(this.handleError())
    );
  }
  
  // Fetches extra data for the filters
  getTracksFilterData(): Observable<FilterDTO[]> {
    return this.http.get<FilterDTO[]>(`${this.tracksURL}/filter`).pipe(
      catchError(this.handleError())
    );
  }


  private getTracksBackend(): Observable<SimpleTrack[]> {
    return this.http.get<SimpleTrack[]>(this.tracksURL).pipe(
      tap(tracks => {
        this.tracksCache = tracks;
        this.tracksSubject.next(tracks);
      }),
      catchError(this.handleError())
    );
  }

  private getTracksRecords(): Observable<RecordsDTO[] | null> {
    return this.http.get<RecordsDTO[]>(this.tracksURL + '/records').pipe(
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
