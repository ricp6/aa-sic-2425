import { Component, OnInit } from '@angular/core';
import { TracksService } from '../../services/track.service';
import { Track } from '../../interfaces/track';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css'
})
export class TracksComponent implements OnInit {

  searchTerm: string = '';
  onlyFavs: boolean = false;

  tracks: Track[] = [];

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
    private readonly tracksService: TracksService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tracksService.getAll().subscribe({
      next: (data) => {
        this.tracks = data;
      },
      error: (err) => {
        console.error('Tracks loading failed:', err);
        // You’re already showing toast inside the service on error
      }
    });
  }

  filteredTracks(): Track[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.tracks.filter(track => {
      const matchesSearch =
        track.name.toLowerCase().includes(search) ||
        this.location(track).toLowerCase().includes(search);

      const matchesFav = !this.onlyFavs || this.isFav(track);

      // Add other filters here if needed

      return matchesSearch && matchesFav;
    });
  }

  location(track: Track): string {
    return track.address.substring(track.address.lastIndexOf(",") + 1, track.address.length)
  }

  isFav(track: Track): boolean {
    return this.user!.favoriteTrackIds.includes(track.id);
  }

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
  }

  setFav(track: Track): void {
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

  showTrack(track : Track): void {
    this.router.navigate(['/tracks', track.id], {
      state: { track: track }
    });
  }
}
