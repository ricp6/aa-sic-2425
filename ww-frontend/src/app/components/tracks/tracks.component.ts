import { Component, OnInit } from '@angular/core';
import { TracksService } from '../../services/tracks.service';
import { Track } from '../../interfaces/track';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css'
})
export class TracksComponent implements OnInit {

  searchTerm: string = '';
  onlyFavs: boolean = false;

  tracks: Track[] = [];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly tracksService: TracksService
  ) {}

  ngOnInit(): void {
    this.tracksService.getAll().subscribe({
      next: (data) => {
        this.tracks = data;
      },
      error: (err) => {
        console.error('Track loading failed:', err);
        // You’re already showing toast inside the service on error
      }
    });
  }

  filteredTracks() {
    const search = this.searchTerm.trim().toLowerCase();
    return this.tracks.filter(track =>
      track.name.toLowerCase().includes(search) ||
      this.location(track).toLowerCase().includes(search)
    );
  }

  location(track: Track): string {
    return track.address.substring(track.address.lastIndexOf(",") + 1, track.address.length)
  }

  isFav(track: Track): boolean {
    return this.authService.getCurrentUser()?.favoriteTrackIds.includes(track.id) ?? false;
  }

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
  }

  setFav(track: any): void {
    track.favorite = !track.favorite;
  }

  showTrack(track : Track) {
    this.router.navigate(['/tracks', track.id], {
      state: { track: track }
    });
  }
}
