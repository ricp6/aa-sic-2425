import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SimpleUser, UserProfile } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userURL = "http://localhost/api/users";

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {}

  getAllUsers(): Observable<SimpleUser[]> {
    return this.http.get<SimpleUser[]>(`${this.userURL}`).pipe(
      catchError(this.handleError())
    );
  }

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
      }),
      catchError(this.handleError())
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
      }),
      catchError(this.handleError())
    );
  }

  isFavorite(trackId: number): boolean {
    const user = this.authService.getCurrentUser();
    return user ? user.favoriteTrackIds.includes(trackId) : false;
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.userURL}/me`).pipe( //Cambio el profile x el me
      catchError((error: HttpErrorResponse) => {
        // console.error('Error loading user profile:', error)
        return throwError(() => error);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.userURL}/change-password`, {
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
