import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Track } from '../../interfaces/track';
import { Router } from '@angular/router';
import { TracksService } from '../../services/track.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  tracks: Track[] = [];
  
  constructor(
    private readonly router: Router,
    private readonly tracksService: TracksService
  ) {}

  ngOnInit(): void {
    this.tracksService.getAll().subscribe({
      next: (data) => {
        this.tracks = data;
      },
      error: (err) => {
        console.error('Tracks loading failed:', err);
        // You’re already showing toast inside the service on error
      }
    });
  }

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
  }

  showTrack(track : Track) {
    this.router.navigate(['/tracks', track.id], {
      state: { track: track }
    });
  }

  location(track: Track): string {
    return track.address.substring(track.address.lastIndexOf(",") + 1, track.address.length)
  }
}
