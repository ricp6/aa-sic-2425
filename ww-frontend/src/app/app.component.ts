import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { TrackService } from './services/track.service';
import { NotificationService } from './services/notification.service';
import { ViewService } from './services/view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  user: User | null = null;
  isAuthPage: boolean = false;
  isNotificationsPage: boolean = false;
  isEnterpriseView: boolean = false;
  unreadNotificationCount: string | number = 0;

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get userName(): string | undefined {
    return this.user?.name;
  }

  get isOwner(): boolean {
    return this.user?.userType === 'OWNER';
  }

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly tracksService: TrackService,
    private readonly viewService: ViewService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Wacky Wheels");

    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.notificationService.unreadNotificationCount$.subscribe(count => {
      this.unreadNotificationCount = count > 10 ? '10+' : count;
    });

    // Load tracks once at app start
    this.tracksService.refreshTracks().subscribe();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthPage = event.urlAfterRedirects.startsWith('/auth');
        this.isNotificationsPage = event.urlAfterRedirects.startsWith('/notifications');

        // Automatically set the view mode from the route
        const currentRoute = this.router.routerState.root;
        let route = currentRoute;

        // Drill down to the deepest child route
        while (route.firstChild) {
          route = route.firstChild;
        }

        const view = route.snapshot.data['view'] as 'client' | 'enterprise' | undefined;
        if (view) {
          this.viewService.setView(view);
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["auth/login"]);
  }

  toggleEnterprise(): void {
    const route = this.isEnterpriseView ? '/home' : '/enterprise';
    this.router.navigate([route]);
  }
}
