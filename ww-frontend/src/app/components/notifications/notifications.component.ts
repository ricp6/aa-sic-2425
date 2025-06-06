import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notifications.service';
import { Notification } from '../../interfaces/notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadNotifications: Notification[] = [];
  readNotifications: Notification[] = [];
  errorMessage: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadNotifications = this.notifications.filter(n => !n.isRead); // Usa 'n.read'
        this.readNotifications = this.notifications.filter(n => n.isRead);    // Usa 'n.read'
      },
      error: (error) => {
        console.error('Error loading the notifications:', error);
        this.snackBar.open('Error loading the notifications.', 'Close', { duration: 3000 });
      }
    });
  }

  markNotificationAsRead(notification: Notification): void {
    if (notification.isRead) { // Usa 'notification.read'
      return;
    }
    this.notificationService.markNotificationAsRead(notification.id).subscribe({
      next: (updatedNotification) => {
        const index = this.notifications.findIndex(n => n.id === updatedNotification.id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
          this.snackBar.open('Notification marked as read.', 'Close', { duration: 2000 });
          this.loadNotifications();
        }
      },
      error: (error) => {
        console.error('Error marking as read:', error);
        this.snackBar.open('Error marking as read.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.snackBar.open('Notification deleted successfully.', 'Close', { duration: 2000 });
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error deleting the notification:', error);
        this.snackBar.open('Error deleting the notification.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteAllReadNotifications(): void {
    if (this.readNotifications.length === 0) {
      this.snackBar.open('No notification to delete.', 'Close', { duration: 2000 });
      return;
    }
    // ... (restante do código igual) ...
    this.notificationService.deleteReadNotifications().subscribe({
      next: () => {
        this.snackBar.open('Every notification has been deleted.', 'Close', { duration: 2000 });
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error deleting notifications:', error);
        this.snackBar.open('Error deleting notifications.', 'Close', { duration: 3000 });
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
        this.snackBar.open('Every notification has been marked as read.', 'Close', { duration: 2000 });
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking everything as read:', error);
        this.snackBar.open('Error marking everything as read.', 'Close', { duration: 3000 });
      }
    });
  }
}
