import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  user: User | null = null;
  isAuthPage: boolean = false;
  isEnterpriseView: boolean = false;
  notificationsIcon: string = 'notifications_none';
  
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
  
  get numNotifications(): string | number {
    const count = /*this.user?.numNotifications ??*/ 1;
    return count > 10 ? '10+' : count;
  }

  get isOwner(): boolean {
    return this.user?.userType === 'OWNER';
  }

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Wacky Wheels");
    
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthPage = event.urlAfterRedirects.startsWith('/auth');
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["home"]);
  }

  toggleEnterprise(): void {
    this.isEnterpriseView = !this.isEnterpriseView;
    const title = this.isEnterpriseView ? "Wacky Wheels Enterprise" : "Wacky Wheels";
    this.titleService.setTitle(title);

    const route = this.isEnterpriseView ? '/enterprise/home' : '/home';
    this.router.navigate([route]);
  }
}
