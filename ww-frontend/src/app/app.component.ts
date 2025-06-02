import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  userName: string = 'Example';

  navLinks = [
    { path: 'tracks', label: 'Tracks' },
    { path: 'reservations', label: 'Reservations' },
    { path: 'sessions', label: 'Sessions' },
  ];
  
  constructor(
    private readonly titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Wacky Wheels");
  }
  
  logout() {
    // Implement logout logic here
  }
}
