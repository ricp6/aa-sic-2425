import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionDetail, PodiumEntry } from '../../interfaces/session-details';
import { SessionService } from '../../services/session-details.service';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent implements OnInit {
  session: SessionDetail | undefined;
  trackName: string = 'Speed Karting';
  podiumEntries: PodiumEntry[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.getSessionDetails();
  }

  getSessionDetails(): void {
    this.sessionService.getSession(1)
      .subscribe((sessionData) => {
        this.session = sessionData;
        if (this.session) {
          this.podiumEntries = this.sessionService.getPodiumEntries(this.session.classifications);
        }
      });
  }

  goBack(): void {
    window.history.back();
  }
}
