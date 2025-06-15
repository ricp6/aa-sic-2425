import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, interval, Observable, of, Subscription, switchMap, tap, throwError } from 'rxjs'; // Importar BehaviorSubject e tap
import { Notification } from '../interfaces/notification';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service'; // Importar AuthService

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost/api/notifications';
  private readonly POLLING_INTERVAL_MS = 600000;

  private readonly _unreadNotificationCount = new BehaviorSubject<number>(0); // Inicializar com 0
  public unreadNotificationCount$ = this._unreadNotificationCount.asObservable();

  private readonly _notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this._notifications.asObservable();

  private pollingSubscription?: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) {
    // Start polling if user is logged in
    this.authService.user$.subscribe(user => {
      if (user) {
        this._unreadNotificationCount.next(user.unreadNotificationCount);
        this.startPolling();
      } else {
        // Stop polling and reset count if he is not
        this.stopPolling();
        this._unreadNotificationCount.next(0);
        this._notifications.next([]);
      }
    });
  }

  private startPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    this.pollingSubscription = interval(this.POLLING_INTERVAL_MS)
      .pipe(
        switchMap(() => this.getNotifications().pipe(
          catchError(error => {
            // console.error('Polling error:', error)
            return of([]);
          })
        ))
      )
      .subscribe(newNotifications => {
        const current = this._notifications.value;
        const currentIds = new Set(current.map(n => n.id));
        const hasNew = newNotifications.some(n => !currentIds.has(n.id));

        if (hasNew) {
          this.toastr.info('You have new notifications!', 'New Notification');
        }

        this._notifications.next(newNotifications);
      });
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
  }

  setUnreadNotificationCount(count: number): void {
    this._unreadNotificationCount.next(count);
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      tap(notifications => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.setUnreadNotificationCount(unreadCount);
      }),
      catchError(this.handleError())
    );
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const currentCount = this._unreadNotificationCount.value;
        if (currentCount > 0) {
          this.setUnreadNotificationCount(currentCount - 1);
        }
        this.refreshNotifications(); // ensure UI reflects the change
      }),
      catchError(this.handleError())
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshNotifications()),
      catchError(this.handleError())
    );
  }

   markAllNotificationsAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        this.setUnreadNotificationCount(0);
        this.refreshNotifications();
      }),
      catchError(this.handleError())
    );
  }

  deleteReadNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/read`).pipe(
      tap(() => this.refreshNotifications()),
      catchError(this.handleError())
    );
  }

  refreshNotifications(): void {
    this.getNotifications().subscribe({
      next: (data) => this._notifications.next(data),
      error: () => {} // errors already handled in getNotifications()
    });
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
