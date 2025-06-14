import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Location } from '@angular/common';
import { SessionDetails, Classification } from '../../interfaces/session';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent implements OnInit {

  session!: SessionDetails;
  
  get podium(): Classification[] {
    return this.session.classifications.slice(0,3);
  }

  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionService,
    private readonly toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.loadSessionDetails(+idParam);
      } else {
        console.error('Session ID not provided in route.');
        this.toastr.error("Please navigate using the page commands.", "Invalid URL!");
        this.goBack();
      }
    });
  }

  loadSessionDetails(id: number): void {
    this.sessionService.getSessionDetails(id).subscribe({
      next: (session: SessionDetails) => {
        // Sort classifications by final position before saving
        session.classifications.sort((a, b) => a.finalPosition - b.finalPosition);
        this.session = session;
      },
      error: (err) => {
        console.error('Error fetching session details:', err);
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
