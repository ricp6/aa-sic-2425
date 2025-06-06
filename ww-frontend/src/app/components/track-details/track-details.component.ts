import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private trackService: TrackService
  ) { }

  ngOnInit(): void {
    this.getTrack();
  }

  getTrack(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.trackService.getTrack(id)
      .subscribe(trackData => this.track = trackData);
  }

  setActiveTab(tab: 'about' | 'rankings'): void {
    this.activeTab = tab;
  }
}
