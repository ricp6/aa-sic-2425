import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  readNotifications: Notification[] = [];
  errorMessage: string | null = null;

  private pollingSubscription: Subscription | undefined;
  private readonly POLLING_INTERVAL_MS = 10000;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();

    if (this.authService.isLoggedIn()) {
      this.startPolling();
    }

    this.authService.user$.subscribe(user => {
      if (user) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    this.pollingSubscription = interval(this.POLLING_INTERVAL_MS)
      .subscribe(() => {
        this.loadNotifications(true);
      });
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  loadNotifications(isPolling: boolean = false): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        if (isPolling && this.notifications.length < data.length) {
          this.toastr.info('You have new notifications!', 'New Notification');
        }
        this.notifications = data;
        this.unreadNotifications = this.notifications.filter(n => !n.isRead);
        this.readNotifications = this.notifications.filter(n => n.isRead);
      },
      error: (error) => {
        console.error('Error loading the notifications:', error);
        this.toastr.error('Error loading notifications.', 'Error');
      }
    });
  }

  markNotificationAsRead(notification: Notification): void {
    this.notificationService.markNotificationAsRead(notification.id).subscribe({
      next: () => {
        const indexUnread = this.unreadNotifications.findIndex(n => n.id === notification.id);
        if (indexUnread > -1) {
          const markedNotification = this.unreadNotifications.splice(indexUnread, 1)[0];
          markedNotification.isRead = true;
          this.readNotifications.unshift(markedNotification);
          this.toastr.success('Notification marked as read!');
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
        this.toastr.error('Error marking notification as read.', 'Error');
      }
    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.unreadNotifications = this.unreadNotifications.filter(n => n.id !== id);
        this.readNotifications = this.readNotifications.filter(n => n.id !== id);
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.toastr.success('Notification deleted successfully.');
      },
      error: (error) => {
        console.error('Error deleting the notification:', error);
        this.toastr.error('Error deleting notification.', 'Error');
      }
    });
  }

  deleteAllReadNotifications(): void {
    if (this.readNotifications.length === 0) {
      this.snackBar.open('No notification to delete.', 'Close', { duration: 2000 });
      return;
    }
    this.notificationService.deleteReadNotifications().subscribe({
      next: () => {
        this.readNotifications = [];
        this.notifications = this.unreadNotifications.slice();
        this.toastr.success('All read notifications deleted.');
      },
      error: (error) => {
        console.error('Error deleting notifications:', error);
        this.toastr.error('Error deleting read notifications.', 'Error');
      }
    });
  }

  markAllAsRead(): void {
    if (this.unreadNotifications.length === 0) {
      this.snackBar.open('No unread notifications.', 'Close', { duration: 2000 });
      return;
    }
    this.notificationService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.readNotifications.unshift(...this.unreadNotifications.map(n => ({ ...n, isRead: true })));
        this.unreadNotifications = [];
        this.toastr.success('All notifications marked as read!');
      },
      error: (error) => {
        console.error('Error marking everything as read:', error);
        this.toastr.error('Error marking all notifications as read.', 'Error');
      }
    });
  }
}
