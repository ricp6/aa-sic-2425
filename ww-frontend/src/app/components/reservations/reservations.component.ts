import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationStatus } from '../../interfaces/reservation';


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {

  activeReservations: Reservation[] = []; //
  completedReservations: Reservation[] = []; //
  selectedTab: 'active' | 'completed' = 'active'; //

  constructor() { } //

  ngOnInit(): void { //
    this.loadMockReservations(); //
  }

  loadMockReservations(): void { //
    const mockData: Reservation[] = [ //
      {
        id: 1,
        trackName: 'Seaside Raceway',
        numberOfParticipants: 8,
        date: '05/02/2025',
        time: '18:00 - 19:00',
        status: ReservationStatus.ACCEPTED,
        trackImage: '/track1.jpg'
      },
      {
        id: 2,
        trackName: 'Grand Prix Circuit',
        numberOfParticipants: 3,
        date: '16/02/2025',
        time: '15:00 - 15:30',
        status: ReservationStatus.PENDING,
        trackImage: '/track1.jpg'
      },
      {
        id: 3,
        trackName: 'Seaside Raceway',
        numberOfParticipants: 7,
        date: '20/02/2025',
        time: '21:00 - 21:20',
        status: ReservationStatus.ACCEPTED,
        trackImage: '/track1.jpg'
      },
      {
        id: 4,
        trackName: 'City Karting',
        numberOfParticipants: 5,
        date: '01/01/2025',
        time: '10:00 - 10:45',
        status: ReservationStatus.CONCLUDED,
        trackImage: '/track1.jpg'
      },
      {
        id: 5,
        trackName: 'Forest Track',
        numberOfParticipants: 4,
        date: '02/01/2025',
        time: '16:00 - 17:00',
        status: ReservationStatus.REJECTED,
        trackImage: '/track1.jpg'
      },
      {
        id: 6,
        trackName: 'Desert Race Track',
        numberOfParticipants: 6,
        date: '08/06/2025',
        time: '11:00 - 12:00',
        status: ReservationStatus.ACCEPTED,
        trackImage: '/track1.jpg'
      }
    ];


    this.activeReservations = mockData.filter(res =>
      res.status === ReservationStatus.PENDING || res.status === ReservationStatus.ACCEPTED
    ); //

    this.completedReservations = mockData.filter(res =>
      res.status === ReservationStatus.REJECTED || res.status === ReservationStatus.CONCLUDED
    ); //


    this.activeReservations.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-') + 'T' + a.time.split(' ')[0]);
      const dateB = new Date(b.date.split('/').reverse().join('-') + 'T' + b.time.split(' ')[0]);
      return dateA.getTime() - dateB.getTime();
    });

  }

  selectTab(tab: 'active' | 'completed'): void { //
    this.selectedTab = tab; //
  }

  get todayActiveReservations(): Reservation[] {
    const today = new Date();
    const todayString = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return this.activeReservations.filter(res => res.date === todayString);
  }

  get futureActiveReservations(): Reservation[] {
    const today = new Date();
    const todayString = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return this.activeReservations.filter(res => res.date !== todayString);
  }
}
