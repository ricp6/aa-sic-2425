import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { SimpleTrack, Track, TrackWithRecords } from '../../interfaces/track';
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
          const recordsMap = new Map(records!.map(r => [r.trackId, r]));
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

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
  }

  setFav(track: TrackWithRecords): void {
    console.log("before ", this.user?.favoriteTrackIds)
    if (!this.isFav(track)) {
      this.user!.favoriteTrackIds.push(track.id);
      /*this.userService.removeFavorite(track.id).subscribe({
        next: () => {
          this.toastr.info(`${track.name} removed from favorites.`);
          },
          error: () => {
            this.toastr.error(`Failed to remove ${track.name} from favorites.`);
            }
            });*/
            console.log("add ", this.user?.favoriteTrackIds)
          } else {
            this.user!.favoriteTrackIds = this.user!.favoriteTrackIds.filter(id => id !== track.id);
            console.log("remove ", this.user?.favoriteTrackIds)
      /*this.userService.addFavorite(track.id).subscribe({
        next: () => {
          this.toastr.success(`${track.name} added to favorites!`);
        },
        error: () => {
          this.toastr.error(`Failed to add ${track.name} to favorites.`);
        }
      });*/
    }
  }

  showTrack(track : Track | SimpleTrack): void {
    this.router.navigate(['/tracks', track.id]);
  }
}
