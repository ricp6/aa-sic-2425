import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  tracks = [
    {
      name: 'Speed Karting',
      location: 'Lisbon',
      image: '/track1.jpg'
    },
    {
      name: 'Grand Pix Circuit',
      location: 'Porto',
      image: '/track2.jpg'
    },
    {
      name: 'Urban Kart Arena',
      location: 'Braga',
      image: '/track3.jpeg'
    },
    {
      name: 'Riverside Raceway',
      location: 'Famalicão',
      image: '/track4.jpg'
    },
    {
      name: 'Riverside Raceway',
      location: 'Famalicão',
      image: '/track4.jpg'
    },
    {
      name: 'Riverside Raceway',
      location: 'Famalicão',
      image: '/track4.jpg'
    },
    {
      name: 'Riverside Raceway',
      location: 'Famalicão',
      image: '/track4.jpg'
    },
    {
      name: 'Riverside Raceway',
      location: 'Famalicão',
      image: '/track4.jpg'
    }
  ];
  
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
  }

}
