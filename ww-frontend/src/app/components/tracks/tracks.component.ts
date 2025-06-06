import { Component } from '@angular/core';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css'
})
export class TracksComponent {
  searchTerm: string = '';
  onlyFavs: boolean = false;

  tracks = [
    {
      name: 'Speed Karting',
      location: 'Porto',
      image: '/track1.jpg',
      favorite: true,
    },
    {
      name: 'Grand Prix Circuit',
      location: 'Lisboa',
      image: '/track2.jpg',
      favorite: false,
    },
    {
      name: 'Riverside Kartway',
      location: 'Leiria',
      image: '/track3.jpeg',
      favorite: false,
    },
    {
      name: 'Seaside Raceway',
      location: 'Faro',
      image: '/track4.jpg',
      favorite: false,
    },
  ];

  filteredTracks() {
    const search = this.searchTerm.trim().toLowerCase();
    return this.tracks.filter(track =>
      track.name.toLowerCase().includes(search) ||
      track.location.toLowerCase().includes(search)
    );
  }

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
  }

  setFav(track: any): void {
    track.favorite = !track.favorite;
  }
}
