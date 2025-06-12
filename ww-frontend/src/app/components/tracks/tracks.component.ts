import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { TrackWithRecords } from '../../interfaces/track';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { Observable, combineLatest, Subscription, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit, OnDestroy {

  searchTerm: string = '';
  onlyFavs: boolean = false;
  showOperationalOnly: boolean = false;

  tracks: TrackWithRecords[] | null = null; //
  private tracksSubscription: Subscription | undefined;

  // Autocomplete e Multi-seleção de Cidades
  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  cityFilterControl = new FormControl('');
  availableCities: string[] = [];
  filteredCityOptions!: Observable<string[]>;
  selectedCities: string[] = [];

  get isLoggedIn(): boolean { //
    return this.authService.isLoggedIn();
  }

  get user(): User | null { //
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
    const tracksObservable = this.isLoggedIn ?
      this.tracksService.getTracksWithRecords() :
      this.tracksService.getTracksCached().pipe(map(tracks => tracks as TrackWithRecords[])); //

    this.tracksSubscription = tracksObservable.subscribe({
      next: (tracks) => {
        this.tracks = tracks;
        this.populateAvailableCities();
        this.applyFilters();
      },
      error: (err) => {
        console.error("Failed to load tracks", err);
        this.tracks = [];
      }
    });

    this.filteredCityOptions = this.cityFilterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || '')),
    );
  }

  ngOnDestroy(): void {
    if (this.tracksSubscription) {
      this.tracksSubscription.unsubscribe();
    }
  }

  private populateAvailableCities(): void {
    const uniqueCities = new Set<string>();
    this.tracks?.forEach(track => {
      const city = track.address.trim();
      if (city) {
        uniqueCities.add(city);
      }
    });
    this.availableCities = Array.from(uniqueCities).sort();
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableCities.filter(city =>
      city.toLowerCase().includes(filterValue) && !this.selectedCities.includes(city)
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const cityToAdd = event.option.viewValue;
    if (cityToAdd && !this.selectedCities.includes(cityToAdd)) {
      this.selectedCities.push(cityToAdd);
      this.applyFilters();
    }
    this.cityInput.nativeElement.value = '';
    this.cityFilterControl.setValue(null);
  }

  remove(city: string): void {
    const index = this.selectedCities.indexOf(city);
    if (index >= 0) {
      this.selectedCities.splice(index, 1);
      this.applyFilters();
    }
  }

  applyFilters(): void {
  }

  filteredTracks(): TrackWithRecords[] | undefined {
    if (!this.tracks) {
      return undefined;
    }

    const search = this.searchTerm.trim().toLowerCase();

    return this.tracks.filter(track => {
      const matchesSearch =
        track.name.toLowerCase().includes(search) ||
        track.address.toLowerCase().includes(search);

      const matchesFav = !this.onlyFavs || this.isFav(track);
      const matchesAvailability = !this.showOperationalOnly || track.available;


      const matchesCity = this.selectedCities.length === 0 ||
        this.selectedCities.includes(track.address.trim());

      return matchesSearch && matchesFav && matchesAvailability && matchesCity;
    });
  }

  isFav(track: TrackWithRecords): boolean {
    return this.user?.favoriteTrackIds?.includes(track.id) ?? false; //
  }

  setFav(track: TrackWithRecords): void {
    if (!this.isFav(track)) {
      this.userService.addFavorite(track.id).subscribe({
        next: () => {
          if (this.user) {
            this.user.favoriteTrackIds.push(track.id);
          }
          this.toastr.success('Track added to favorites!');
        },
        error: (err) => {
          console.error('Failed to add favorite', err);
          this.toastr.error('Could not add track to favorites.');
        }
      });
    } else {
      this.userService.removeFavorite(track.id).subscribe({ //
        next: () => {
          if (this.user) {
            this.user.favoriteTrackIds = this.user.favoriteTrackIds.filter(id => id !== track.id);
          }
          this.toastr.info('Track removed from favorites.');
        },
        error: (err) => {
          console.error('Failed to remove favorite', err);
          this.toastr.error('Could not remove track from favorites.');
        }
      });
    }
  }

  toggleFavs(): void {
    this.onlyFavs = !this.onlyFavs;
    this.applyFilters();
  }

  toggleOperational(): void {
    this.showOperationalOnly = !this.showOperationalOnly;
    this.applyFilters();
  }

  showTrack(track : TrackWithRecords): void {
    this.router.navigate(['/tracks', track.id]);
  }
}
