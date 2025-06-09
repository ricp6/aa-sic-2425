import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { TrackWithRecords } from '../../interfaces/track';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css'
})
export class TracksComponent implements OnInit {

  searchTerm: string = '';
  onlyFavs: boolean = false;

  tracks: TrackWithRecords[] | null = null;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user(): User | null {
    return this.authService.getCurrentUser();
  }

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tracksService: TrackService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn) {
      combineLatest(
        this.tracksService.getAll(),
        this.tracksService.getTracksRecords()
      ).subscribe({
        next: ([tracks, records]) => {
          const recordsMap = new Map(records!.map(r => [r.id, r]));
          this.tracks = (tracks ?? []).map(track => ({
            ...track,
            personalRecord: recordsMap.get(track.id)?.personalRecord ?? null,
            trackRecord: recordsMap.get(track.id)?.trackRecord ?? null
          }));
        },
        error: () => { this.tracks = []; }
      });
    } else {
      this.tracksService.getAll().subscribe({
        next: (tracks) => { this.tracks = tracks as TrackWithRecords[]; },
        error: () => { this.tracks = []; }
      });
    }
  }

  filteredTracks(): TrackWithRecords[] | undefined {
    const search = this.searchTerm.trim().toLowerCase();

    return this.tracks?.filter(track => {
      const matchesSearch =
        track.name.toLowerCase().includes(search) ||
        track.address.toLowerCase().includes(search);

      const matchesFav = !this.onlyFavs || this.isFav(track);

      // Add other filters here if needed

      return matchesSearch && matchesFav;
    });
  }

  isFav(track: TrackWithRecords): boolean {
    return this.user!.favoriteTrackIds.includes(track.id);
  }
  
  setFav(track: TrackWithRecords): void {
    if (!this.isFav(track)) {
      this.userService.addFavorite(track.id).subscribe();
    } else {
      this.userService.removeFavorite(track.id).subscribe();
    }
  }

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
  }

  showTrack(track : TrackWithRecords): void {
    this.router.navigate(['/tracks', track.id]);
  }
}
