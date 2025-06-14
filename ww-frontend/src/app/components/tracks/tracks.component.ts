// tracks.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { TrackWithRecords, DayOfWeek, FilterDTO, SimpleTrack } from '../../interfaces/track';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Meta } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ViewService } from '../../services/view.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit, OnDestroy {

  isEnterpriseView: boolean = false;

  searchTerm: string = '';
  onlyFavs: boolean = false;
  showOperationalOnly: boolean = false;

  tracks: TrackWithRecords[] | null = null;
  private tracksSubscription: Subscription | undefined;

  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  cityFilterControl = new FormControl('');
  availableCities: string[] = [];
  filteredCityOptions!: Observable<string[]>;
  selectedCities: string[] = [];

  minKartsFilterControl = new FormControl<number | null>(null);

  selectedDaysToFilterBy: DayOfWeek[] = [];
  availableDaysOfWeek = Object.values(DayOfWeek);

  filterDataMap: Map<number, FilterDTO> = new Map();
  advancedFiltersLoaded: boolean = false;

  get showAdvancedInfo(): boolean {
    return this.isLoggedIn && !this.isEnterpriseView;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user(): User | null {
    return this.authService.getCurrentUser();
  }

  constructor(
    private readonly router: Router,
    private metaService: Meta,
    private readonly viewService: ViewService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tracksService: TrackService
  ) {}

  ngOnInit(): void {
    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    this.metaService.updateTag({
      name:'description',
      content: 'This page shows every track available on our website and their status, allowing you to acess each track and quickly see your record in those tracks.It also supports filtering the search of tracks'
    });

    let tracksObservable: Observable<TrackWithRecords[] | SimpleTrack[]>;
    if (this.isEnterpriseView && this.isLoggedIn) {
      tracksObservable = this.tracksService.getOwnedTracks();
    } else if (this.isLoggedIn) {
      tracksObservable = this.tracksService.getTracksWithRecords();
    } else {
      tracksObservable = this.tracksService.getTracksCached();
    }

    this.tracksSubscription = tracksObservable.subscribe({
      next: (tracksData) => {
        this.tracks = tracksData.map(track => ({ ...track, personalRecord: null, trackRecord: null })) as TrackWithRecords[];
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
      map(value => this._filterCities(value ?? '')),
    );
    this.minKartsFilterControl.valueChanges.subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    if (this.tracksSubscription) {
      this.tracksSubscription.unsubscribe();
    }
  }

  loadAdvancedFilterData(): void {
    if (!this.advancedFiltersLoaded) {
      this.tracksService.getTracksFilterData().subscribe({
        next: (filterData) => {
          this.filterDataMap = new Map(filterData.map(f => [f.trackId, f]));
          this.advancedFiltersLoaded = true;
        },
        error: (err) => {
          console.error("Failed to load advanced filter data", err);
        }
      });
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
    this.availableCities = Array.from(uniqueCities).sort((a, b) => a.localeCompare(b));
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

  toggleDaySelection(day: DayOfWeek): void {
    const index = this.selectedDaysToFilterBy.indexOf(day);
    if (index === -1) {
      this.selectedDaysToFilterBy.push(day);
    } else {
      this.selectedDaysToFilterBy.splice(index, 1);
    }
    this.applyFilters();
  }

  isDaySelected(day: DayOfWeek): boolean {
    return this.selectedDaysToFilterBy.includes(day);
  }

  applyFilters(): void {
  }

  filteredTracks(): TrackWithRecords[] | undefined {
    if (!this.tracks) {
      return undefined;
    }

    const search = this.searchTerm.trim().toLowerCase();
    const minKartsFilter = this.minKartsFilterControl.value;

    return this.tracks.filter(track => {
      const matchesSearch =
        track.name.toLowerCase().includes(search) ||
        track.address.toLowerCase().includes(search);

      const matchesFav = !this.onlyFavs || this.isFav(track);
      const matchesAvailability = !this.showOperationalOnly || track.available;

      const matchesCity = this.selectedCities.length === 0 ||
        this.selectedCities.includes(track.address.trim());

      let matchesMinKarts = true;
      let matchesDayFilter = true;

      if (this.advancedFiltersLoaded) {
        const trackFilterInfo = this.filterDataMap.get(track.id);

        if (minKartsFilter !== null && minKartsFilter !== undefined) {
          matchesMinKarts = (trackFilterInfo?.maxKarts !== null && trackFilterInfo?.maxKarts !== undefined &&
            trackFilterInfo.maxKarts >= minKartsFilter);
        }

        if (this.selectedDaysToFilterBy.length > 0) {
          matchesDayFilter = this.selectedDaysToFilterBy.some(day =>
            !trackFilterInfo?.notOpen?.includes(day)
          );
        } else {
          matchesDayFilter = true;
        }
      }

      return matchesSearch && matchesFav && matchesAvailability && matchesCity && matchesMinKarts && matchesDayFilter;
    });
  }

  isFav(track: TrackWithRecords): boolean {
    return this.user?.favoriteTrackIds?.includes(track.id) ?? false;
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
    this.applyFilters();
  }

  toggleOperational(): void {
    this.showOperationalOnly = !this.showOperationalOnly;
    this.applyFilters();
  }

  showTrack(track : TrackWithRecords): void {
    const routePrefix = this.isEnterpriseView ? '/enterprise/tracks' : '/tracks';
    this.router.navigate([routePrefix, track.id]);
  }
}
