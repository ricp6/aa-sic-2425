import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Notification } from '../interfaces/notification';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:8080/api/notifications';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) { }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log("erro get notifications: ")
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
        } else {
          this.toastr.error('An error occurred while loading the notifications', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {}).pipe(
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
          this.toastr.error('An error occurred while marking the notification as read', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
          this.toastr.error('An error occurred while deleting the notification', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  markAllNotificationsAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(
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
          this.toastr.error('An error occurred while marking all notifications as read', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  deleteReadNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/read`).pipe(
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
          this.toastr.error('An error occurred while deleting all notifications', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }
}
