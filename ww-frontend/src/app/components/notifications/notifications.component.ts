import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  readNotifications: Notification[] = [];

  constructor(
    private readonly notificationService: NotificationService,
    private readonly snackBar: MatSnackBar,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {  
    // Immediately fetch notifications when the component loads
    this.notificationService.refreshNotifications();

    // Subscribe for further updates
    this.notificationService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadNotifications = notifications.filter(n => !n.isRead);
        this.readNotifications = notifications.filter(n => n.isRead);
      }
    });
  }

  markNotificationAsRead(notification: Notification): void {
    this.notificationService.markNotificationAsRead(notification.id).subscribe({
      next: () => {
        this.toastr.success('Notification marked as read!');
        // No need to update local state manually — the service will refresh notifications
      }
    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.toastr.info('Notification deleted successfully.');
        // Notifications list will be refreshed via service
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
        this.toastr.info('All read notifications deleted.');
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
        this.toastr.success('All notifications marked as read!');
      }
    });
  }
}
