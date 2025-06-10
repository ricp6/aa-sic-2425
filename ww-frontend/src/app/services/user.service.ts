import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userURL = "http://localhost:8080/api/users";

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {}

  addFavorite(trackId: number): Observable<void> {
    return this.http.post<void>(`${this.userURL}/favorites/add/${trackId}`, null).pipe(
      tap(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          if (!user.favoriteTrackIds.includes(trackId)) {
            user.favoriteTrackIds.push(trackId);
            this.authService.updateUser(user);
          }
        }
        this.toastr.success("Track added to your favorites!");
      }),
      catchError((error: HttpErrorResponse) => { 
        // This catchError will now receive the *final* error.
        // If the interceptor handled a refresh and a retry, and the retry also failed,
        // this `error` will be the one from the *second* failed attempt,
        // after `authService.logout()` would have been called in the interceptor or auth service.
        // console.log("erro add favorite: ")
        // console.error(error)
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
        } else if (error.status === 404) {
          this.toastr.warning('Track or user not found', 'Failed to add favorite');
        } else {
          this.toastr.error('An error occurred while adding the track to the favorites', 'Server error');
        }
        return throwError(() => error); // Propagate the error for component-specific handling if needed
      })
    );
  }

  removeFavorite(trackId: number): Observable<void> {
    return this.http.delete<void>(`${this.userURL}/favorites/remove/${trackId}`).pipe(
      tap(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          // Filter out the trackId to remove it from the array
          user.favoriteTrackIds = user.favoriteTrackIds.filter(id => id !== trackId);
          this.authService.updateUser(user); 
        }
        this.toastr.success("Track removed from your favorites.");
      }),
      catchError((error: HttpErrorResponse) => { 
        // console.log("erro remove favorite: ")
        // console.error(error)
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
        } else if (error.status === 404) {
          this.toastr.warning('Track or user not found', 'Failed to remove favorite');
        } else {
          this.toastr.error('An error occurred while removing the track from the favorites', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  // You might also want a method to check if a track is a favorite (for UI state)
  isFavorite(trackId: number): boolean {
    const user = this.authService.getCurrentUser();
    return user ? user.favoriteTrackIds.includes(trackId) : false;
  }
}
