import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SimpleTrack } from '../../interfaces/track';
import { Router } from '@angular/router';
import { TrackService } from '../../services/track.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  tracks: SimpleTrack[] | null = null;
  
  constructor(
    private readonly router: Router,
    private readonly tracksService: TrackService
  ) {}

  ngOnInit(): void {
    this.tracksService.getAll().subscribe({
      next: (tracks) => {
        this.tracks = tracks;
      },
      error: (err) => {
        // Optionally handle error, e.g. show a toast
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

  showTrack(track : SimpleTrack) {
    this.router.navigate(['/tracks', track.id], {
      state: { track: track }
    });
  }
}
