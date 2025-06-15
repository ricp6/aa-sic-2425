import { Component, OnInit } from '@angular/core';
import { Session } from '../../interfaces/session';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit {

  sessions: Session[] = [];

  constructor(
    private readonly sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.getSessions();
  }

  getSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessions: Session[]) => {

        sessions.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);

          return dateB.getTime() - dateA.getTime();
        });

        this.sessions = sessions;
      },
      error: (err) => {
        // console.error('Failed to load reservations', err)
      }
    });
  }

  formatTime(timeString: string): string {
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  }
}
