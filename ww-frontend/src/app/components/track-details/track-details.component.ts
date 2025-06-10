import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackDetails } from '../../interfaces/track'
import { TrackService } from '../../services/track.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {

  track!: TrackDetails;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user(): User | null {
    return this.authService.getCurrentUser();
  }
  
  get isFav(): boolean {
    return this.userService.isFavorite(this.track.id);
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly trackService: TrackService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
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

  goBack() {
    this.location.back();
  }

  setFav(): void {
    if (!this.isFav) {
      this.userService.addFavorite(this.track.id).subscribe();
    } else {
      this.userService.removeFavorite(this.track.id).subscribe();
    }
  }
}
