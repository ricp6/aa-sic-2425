import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserProfile } from '../interfaces/user-profile';
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
        console.log("resposta add"); // This should now appear on success
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
        console.error('Error adding favorite:', error); // Log the full error
        if (error.status === 401) {
          this.toastr.warning('Unauthorized', 'Failed to add favorite');
        } else if (error.status === 404) {
          this.toastr.warning('Track or user not found', 'Failed to add favorite');
        } else {
          this.toastr.error('An error occurred while adding the track to the favorites', 'Server error');
        }
        return throwError(() => error);
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
        console.error('Error removing favorite:', error); // Log the full error
        if (error.status === 401) {
          this.toastr.warning('Unauthorized', 'Failed to remove favorite');
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

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.userURL}/me`).pipe( //Cambio el profile x el me
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading user profile:', error);
        return throwError(() => error);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/users/change-password', {
      currentPassword,
      newPassword
    });
  }

  updateProfile(name: string, email: string): Observable<any> {
    return this.http.put(`${this.userURL}/update-profile`, { name, email });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.userURL}/delete`);
  }


}
