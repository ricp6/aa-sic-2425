import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Track } from '../interfaces/track';
import { DaySchedule } from '../interfaces/daySchedule';

@Injectable({
  providedIn: 'root'
})
export class TracksService {
  private readonly tracksURL = "http://localhost:8080/api/tracks";

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}

  getAll(): Observable<Track[]> {
    return this.http.get<Track[]>(this.tracksURL + '/all').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toastr.warning('No tracks loaded.', 'Loading error');
        } else {
          this.toastr.error('An error occoured while loading the tracks.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  createTrack(data: { track: Track }) {
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
          this.toastr.error('An error occoured while processing the registration.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  getSchedule(id: number) {
    return this.http.get<DaySchedule[]>(this.tracksURL + '/:' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toastr.warning('Could not find the track you were looking for.', 'Loading error');
        } else {
          this.toastr.error('An error occoured while loading the track.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }
}
