import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../interfaces/track'
import { TrackService } from '../../services/track.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {
  track: Track | undefined;
  activeTab: 'about' | 'rankings' = 'about';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly trackService: TrackService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/tracks']);
      return;
    }

    this.trackService.getTrack(id).subscribe({
      next: (track) => {
        this.track = track;
      },
      error: () => {
        // Optionally show a toast or redirect
        this.router.navigate(['/tracks']);
      }
    });
  }

  setActiveTab(tab: 'about' | 'rankings'): void {
    this.activeTab = tab;
  }

  goBack() {
    this.location.back();
  }
}
