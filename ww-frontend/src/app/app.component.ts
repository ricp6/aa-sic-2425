import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { TrackService } from './services/track.service';

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
  
  personalLinks = [
    { path: 'tracks', label: 'Tracks' },
    { path: 'reservations', label: 'Reservations' },
    { path: 'sessions', label: 'Sessions' },
  ];
  
  enterpriseLinks = [
    { path: 'enterprise/tracks', label: 'My Tracks' },
    { path: 'enterprise/reservations', label: 'Reservations' },
  ];
  
  get isLoggedIn(): boolean {
    return this.user !== null;
  }
  
  get userName(): string | undefined {
    return this.user?.name;
  }
  
  get unreadNotificationCount(): string | number {
    const count = this.user?.unreadNotificationCount ?? 0;
    return count > 10 ? '10+' : count;
  }

  get isOwner(): boolean {
    return this.user?.userType === 'OWNER';
  }

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly tracksService: TrackService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Wacky Wheels");
    
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    // Load tracks once at app start
    this.tracksService.loadTracks().subscribe();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthPage = event.urlAfterRedirects.startsWith('/auth');
        this.isNotificationsPage = event.urlAfterRedirects.startsWith('/notifications');
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["auth/login"]);
  }

  toggleEnterprise(): void {
    this.isEnterpriseView = !this.isEnterpriseView;
    const title = this.isEnterpriseView ? "Wacky Wheels Enterprise" : "Wacky Wheels";
    this.titleService.setTitle(title);

    const route = this.isEnterpriseView ? '/enterprise/home' : '/home';
    this.router.navigate([route]);
  }
}
