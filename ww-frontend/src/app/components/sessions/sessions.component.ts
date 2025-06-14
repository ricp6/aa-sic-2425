import { Component, OnInit } from '@angular/core';
import { Session } from '../../interfaces/session';

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
        startTime: '18:00',
        endTime: '19:00',
        numParticipants: 6,
        personalRecord: '1:13.052',
        position: 1,
        trackImage: '/track1.jpg'
      },
      {
        id: 2,
        trackName: 'Grand Prix Circuit',
        date: '27/01/2025',
        startTime: '11:00',
        endTime: '12:00',
        numParticipants: 9,
        personalRecord: '1:05.971',
        position: 3,
        trackImage: '/track1.jpg'
      },
      {
        id: 3,
        trackName: 'Speed Karting',
        date: '14/01/2025',
        startTime: '10:00',
        endTime: '10:00',
        numParticipants: 12,
        personalRecord: '1:15.834',
        position: 6,
        trackImage: '/track1.jpg'
      },
      {
        id: 4,
        trackName: 'Seaside Raceway',
        date: '07/01/2025',
        startTime: '10:00',
        endTime: '11:00',
        numParticipants: 5,
        personalRecord: '1:19.473',
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
