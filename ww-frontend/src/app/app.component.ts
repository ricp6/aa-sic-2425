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
  
  isEnterpriseView: boolean = false;
  isAuthPage: boolean = false;
  user: User | null = null;
  
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

  get isOwner(): boolean {
    return this.user?.user_type === 'OWNER';
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
    //this.router.navigate(['/home']);
  }

  toogleEnterprise(): void {
    this.isEnterpriseView = !this.isEnterpriseView;
    const title = this.isEnterpriseView ? "Wacky Wheels Enterprise" : "Wacky Wheels";
    this.titleService.setTitle(title);

    const route = this.isEnterpriseView ? '/enterprise/home' : '/home';
    this.router.navigate([route]);
  }
}
