import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs'; // Importar BehaviorSubject e tap
import { Notification } from '../interfaces/notification';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service'; // Importar AuthService

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:8080/api/notifications';
  private _unreadNotificationCount = new BehaviorSubject<number>(0); // Inicializar com 0
  public unreadNotificationCount$ = this._unreadNotificationCount.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService // Injetar AuthService
  ) {
    // Subscrever a alterações no utilizador para inicializar a contagem
    this.authService.user$.subscribe(user => {
      if (user) {
        this._unreadNotificationCount.next(user.unreadNotificationCount);
      } else {
        this._unreadNotificationCount.next(0); // Resetar se o utilizador não estiver logado
      }
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      tap(notifications => {
        // Atualiza a contagem de não lidas com base nas notificações recebidas
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.setUnreadNotificationCount(unreadCount);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while loading the notifications', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  // Renomeado para setUnreadNotificationCount para clareza
  setUnreadNotificationCount(count: number): void {
    this._unreadNotificationCount.next(count);
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const currentCount = this._unreadNotificationCount.value;
        if (currentCount > 0) {
          this.setUnreadNotificationCount(currentCount - 1);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
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
      // Não diminuímos a contagem aqui diretamente, pois o loadNotifications() irá recarregar e atualizar.
      // Poderíamos adicionar lógica para verificar se a notificação eliminada era não lida, mas
      // carregar novamente as notificações é mais robusto para garantir a consistência.
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
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
      tap(() => {
        this.setUnreadNotificationCount(0); // Todas as notificações são marcadas como lidas
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
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
      // Não precisamos de atualizar a contagem aqui, pois só afeta as notificações lidas.
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
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
