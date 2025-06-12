import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SimpleTrack } from '../../interfaces/track';
import { Router } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  tracks: SimpleTrack[] | null = null;
  
  constructor(
    private readonly router: Router,
    private readonly tracksService: TrackService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tracksService.getTracksCached().subscribe({
      next: (tracks) => {
        // Keep only available tracks
        this.tracks = tracks.filter(track => track.available);
      },
      error: (err) => {
        console.error(err);
        this.toastr.warning("Please refresh the page or try again later.", "Sorry! We could not load the tracks.");
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
