import { Component, OnInit } from '@angular/core';
import { Session } from '../../interfaces/sessions';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit {

  sessions: Session[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadMockSessions();
  }

  loadMockSessions(): void {
    const mockData: Session[] = [
      {
        id: 1,
        trackName: 'Speed Karting',
        date: '02/02/2025',
        time: '18:00 - 19:00',
        numberOfParticipants: 6,
        bestTimeUser: '1:13.052',
        position: 1,
        trackImage: '/track1.jpg'
      },
      {
        id: 2,
        trackName: 'Grand Prix Circuit',
        date: '27/01/2025',
        time: '11:00 - 12:00',
        numberOfParticipants: 9,
        bestTimeUser: '1:05.971',
        position: 3,
        trackImage: '/track1.jpg'
      },
      {
        id: 3,
        trackName: 'Speed Karting',
        date: '14/01/2025',
        time: '09:00 - 10:00',
        numberOfParticipants: 12,
        bestTimeUser: '1:15.834',
        position: 6,
        trackImage: '/track1.jpg'
      },
      {
        id: 4,
        trackName: 'Seaside Raceway',
        date: '07/01/2025',
        time: '10:00 - 11:00',
        numberOfParticipants: 5,
        bestTimeUser: '1:19.473',
        position: 2,
        trackImage: '/track1.jpg'
      }
    ];

    this.sessions = mockData;

    this.sessions.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  }
}
