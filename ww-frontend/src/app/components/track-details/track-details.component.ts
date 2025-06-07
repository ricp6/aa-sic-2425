import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Track } from '../../interfaces/track'
import { TracksService } from '../../services/tracks.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {
  track: Track | undefined;
  activeTab: 'about' | 'rankings' = 'about';

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly tracksService: TracksService
  ) { }

  ngOnInit(): void {
    const state = history.state;

    if (state?.track) {
      this.track = state.track;
    } else {
      // Optionally navigate away or fetch from API if track is missing
      console.warn('Track not found in state, redirecting...');
      this.router.navigate(['/tracks']);
    }
  
  }

  setActiveTab(tab: 'about' | 'rankings'): void {
    this.activeTab = tab;
  }

  goBack() {
    this.location.back();
  }
}
