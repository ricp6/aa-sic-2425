// src/app/components/reservation-form/reservation-form.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { MatStepper } from '@angular/material/stepper';
import { MatCalendar } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';

import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { TrackService } from '../../services/track.service';
import { KartService } from '../../services/kart.service';
import { UserService } from '../../services/user.service';
import { SimpleTrack, TrackDetails } from '../../interfaces/track';
import { Slot } from '../../interfaces/slot';
import { Kart } from '../../interfaces/kart';
import { SimpleUser, User } from '../../interfaces/user';
import { format } from 'date-fns';
import { ViewService } from '../../services/view.service';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('calendar') calendar!: MatCalendar<Date>;
  
  isEnterpriseView: boolean = false;

  // Form Groups for each step
  trackSelectionFormGroup!: FormGroup;
  dateTimeSelectionFormGroup!: FormGroup;
  participantsKartsFormGroup!: FormGroup;

  trackFromState: TrackDetails | null = null;

  tracks: SimpleTrack[] = [];
  filteredTracks!: Observable<SimpleTrack[]>;
  karts: Kart[] = [];

  selectedDate: Date | null = null;
  slots: Slot[] = [];
  slotDuration: number = 0;
  minSelectableDate: Date | undefined;

  users: SimpleUser[] = []
  filteredUsers!: Observable<SimpleUser[]>;
  groupedKarts: { model: string; karts: Kart[] }[] = [];

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get formatedDate(): string {
    if(this.selectedDate) {
      return format(this.selectedDate, 'yyyy-MM-dd');
    }
    return '';
  }

  get formattedSortedSlots(): string {
    const selectedSlots = this.dateTimeSelectionFormGroup.get('selectedSlots')?.value;

    if (!selectedSlots || selectedSlots.length === 0) return '';

    const sorted = [...selectedSlots].sort((a: Slot, b: Slot) =>
      a.startTime.localeCompare(b.startTime)
    );

    return sorted
      .map((slot: Slot) => `${this.formatTime(slot.startTime)} - ${this.formatTime(slot.endTime)}`)
      .join(' | ');
  }


  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly reservationService: ReservationService,
    private readonly userService: UserService,
    private readonly trackService: TrackService,
    private readonly kartService: KartService,
    private readonly authService: AuthService,
    private readonly viewService: ViewService,
    private readonly toastr: ToastrService
  ) {
    // Save state if present
    this.trackFromState = this.router.getCurrentNavigation()?.extras?.state?.['track'] ?? null;
  }

  ngOnInit(): void {
    this.viewService.viewMode$.subscribe(mode => {
      this.isEnterpriseView = (mode === 'enterprise');
    });

    // Initialize the forms
    this.createFormGroups();

    // Setup data filtering observables
    this.setTracksFiltering();

    this.minSelectableDate = new Date();

    // Load initial data
    this.loadUsers();
    this.loadTracks();
  }

  createFormGroups(): void {
    this.trackSelectionFormGroup = this.formBuilder.group({
      selectedTrack: ['', [Validators.required]]
    });

    this.dateTimeSelectionFormGroup = this.formBuilder.group({
      selectedSlots: [[], [Validators.required, this.maxSlots]],
    });

    this.participantsKartsFormGroup = this.formBuilder.group({
      participants: this.formBuilder.array([], [this.participantsValidator.bind(this)])
    });
  }

  maxSlots(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return Array.isArray(value) && value.length > 4 ? { maxSlots: true } : null;
  }

  participantsValidator(formArray: AbstractControl): ValidationErrors | null {
    const participants = formArray as FormArray;
    const totalParticipants = participants.length;

    if (totalParticipants === 0) {
      return { required: true };
    }

    if (totalParticipants > this.karts.length) {
      return { tooManyParticipants: true };
    }

    const seenUserIds = new Set<number>();
    const seenKartIds = new Set<number>();

    const currentUserId = this.authService.getCurrentUser()?.id;
    let currentUserIncluded = false;

    for (let group of participants.controls) {
      const user = group.get('user')?.value;
      const kart = group.get('kart')?.value;

      if (!user || !kart) {
        return { missingFields: true };
      }

      // Validate that user is from allowed list
      const userIsValid = this.users.some(u => u.id === user.id);
      if (!userIsValid) {
        return { invalidUser: true };
      }
      
      // Track if current user is included
      if (user.id === currentUserId) {
        currentUserIncluded = true;
      }

      // Check for duplicate users
      if (seenUserIds.has(user.id)) {
        return { duplicatedUser: true };
      }
      seenUserIds.add(user.id);

      // Check for duplicate karts
      if (seenKartIds.has(kart)) {
        return { duplicatedKart: true };
      }
      seenKartIds.add(kart);
    }
    
    // Enforce rules about current user based on mode
    if (!this.isEnterpriseView && !currentUserIncluded) {
      return { mustIncludeCurrentUser: true };
    }
    if (this.isEnterpriseView && currentUserIncluded) {
      return { cannotIncludeCurrentUser: true };
    }

    return null;
  }

  validateUserInput(control: AbstractControl) {
    const value = control.value;
    const existingErrors = control.errors || {};

    // If the input is not from the options list
    if (typeof value !== 'object' || value === null) {
      control.setErrors({ ...existingErrors, invalidOption: true });
    } else {
      // If it's valid, clear the error
      delete existingErrors['invalidOption'];
      control.setErrors(Object.keys(existingErrors).length ? existingErrors : null);
    }
  }

  setTracksFiltering(): void {
    // Set the filtered tracks observable
    this.filteredTracks = this.trackSelectionFormGroup.get('selectedTrack')!.valueChanges.pipe(
      startWith(''),
      map(track => {
        const name = typeof track === 'string' ? track : track?.name;
        return name ? this.filterTracks(name as string) : this.tracks.slice();
      }),
    );
  }

  filterTracks(query: string): SimpleTrack[] {
    const filterValue = this.normalize(query);

    return this.tracks.filter(track => {
      const normalizedName = this.normalize(track.name);
      const normalizedAddress = this.normalize(track.address);
      return normalizedName.includes(filterValue) || normalizedAddress.includes(filterValue);
    });
  }

  setUsersFiltering(control: AbstractControl<any, any>): void {
    // Set the filtered users observable
    this.filteredUsers = control.valueChanges.pipe(
      startWith(''),
      map(user => {
        const name = typeof user === 'string' ? user : user?.username;
        return name ? this.filterUsers(name as string) : this.users.slice();
      }),
    );
  }

  filterUsers(query: string): SimpleUser[] {
    const filterValue = this.normalize(query);

    return this.users.filter(user => {
      const normalizedName = this.normalize(user.username);
      const normalizedEmail = this.normalize(user.email);
      return normalizedName.includes(filterValue) || normalizedEmail.includes(filterValue);
    });
  }

  normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD') // decompose letters and diacritics (acentos/til/...)
      .replace(/[\u0300-\u036f]/g, ''); // remove diacritics
  }


  resetTrackStep(): void {
    // Reset track form controls
    this.trackSelectionFormGroup.get('selectedTrack')?.setValue('');
    // Reset state vars
    this.karts = [];
    // Reset next steps
    this.resetDateTimeStep();
    this.resetParticipantsStep();
  }

  resetDateTimeStep(): void {
    // Reset date part
    this.selectedDate = null;
    // Reset slots part
    this.resetSlotsSubStep();
  }

  resetSlotsSubStep(): void {
    // Reset date-time form controls
    this.dateTimeSelectionFormGroup.get('selectedSlots')?.setValue([]);
    // Reset state vars
    this.slots = [];
    this.slotDuration = 0;
  }

  resetParticipantsStep(): void {
    // Reset all kart controls
    this.participants.controls.forEach((participantGroup: AbstractControl) => {
      participantGroup.get('kart')?.reset(null);
    });
    this.participantsKartsFormGroup.updateValueAndValidity();

    // Pre-add the current user if in the client mode
    if (!this.isEnterpriseView) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const simpleCurrentUser: SimpleUser = {
          id: currentUser.id,
          username: currentUser.name,
          email: currentUser.email,
          userType: currentUser.userType,
        }
        this.addParticipant({ user: simpleCurrentUser, kart: null });
      }
    }
  }


  // --- Step 1: Track Selection ---

  displayTrackFn(track: SimpleTrack): string {
    return track ? `${track.name} (${track.address})` : '';
  }

  preselectTrack(track: SimpleTrack): void {
    setTimeout(() => {
      this.trackSelectionFormGroup.patchValue({
        selectedTrack: track
      });

      this.onTrackSelected();
      this.stepper.next();
    });
  }

  onTrackSelected(): void {
    // Clear next steps if this one changed
    this.resetDateTimeStep();
    this.resetParticipantsStep();

    // Load karts available for the track
    this.loadKarts();
  }


  // --- Step 2: Date and Time Selection ---

  onDateSelected(): void {
    if (this.selectedDate == null) {
      // Start from step 1
      this.toastr.warning("Error selecting the date.", "Please try again");
      this.stepper.reset();

    } else {
      // Reset the selected slots
      this.resetSlotsSubStep();

      // Load the occupied slots for the selected track and day
      this.loadSlots();
    }
  }

  isSlotSelected(slot: Slot): boolean {
    return this.dateTimeSelectionFormGroup.get('selectedSlots')?.value.includes(slot);
  }

  toggleSlotSelection(slot: Slot): void {
    const control = this.dateTimeSelectionFormGroup.get('selectedSlots')!;
    const current: Slot[] = control.value;

    const index = current.indexOf(slot);
    if (index === -1) {
      control.setValue([...current, slot]);
    } else {
      const updated = [...current];
      updated.splice(index, 1);
      control.setValue(updated);
    }

    control.markAsTouched();
  }


  // --- Step 3: Participants and Karts ---

  displayUserFn(user: SimpleUser): string {
    return user ? `${user.username} - ${user.email}` : '';
  }

  public get participants() {
    return this.participantsKartsFormGroup.get('participants') as FormArray;
  }

  // Parameter ready thinking about edit reservation
  addParticipant(participant: { user: SimpleUser | null, kart: Kart | null }
    = {user: null, kart: null }
  ): void {
    if (this.participants.length < this.karts.length) { // Max participants is max karts available
      const participantGroup = this.formBuilder.group({
        user: [null, Validators.required],
        kart: [null, Validators.required],
      });

      // Set filtering on users autocomplete
      this.setUsersFiltering(participantGroup.get('user')!);

      this.participants.push(participantGroup);
      this.participantsKartsFormGroup.updateValueAndValidity();


    } else {
      this.toastr.warning('This track currently has no karts available to host more participants.',
        `Maximum of ${this.karts.length} participants reached.`);
    }
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
    this.participantsKartsFormGroup.updateValueAndValidity();
  }



  // --- Final Submission ---

  submitReservation(): void {
    // Validate forms info
    if (
      !this.selectedDate ||
      this.trackSelectionFormGroup.invalid ||
      this.dateTimeSelectionFormGroup.invalid ||
      this.participantsKartsFormGroup.invalid
    ) {
      this.toastr.error('Please complete all required fields in the reservation form.', 'Form Invalid');
      // Optionally touch all controls to show errors
      this.trackSelectionFormGroup.markAllAsTouched();
      this.dateTimeSelectionFormGroup.markAllAsTouched();
      this.participantsKartsFormGroup.markAllAsTouched();
      return;
    }

    // Get and format all info needed from the forms
    const selectedTrackId = this.trackSelectionFormGroup.get('selectedTrack')!.value.id; // get id
    const selectedDate  = this.formatedDate;
    const mergedSessions = this.formatAndMergeSessions();
    const formatedParticipants = this.formatParticipants();

    // If the current user is not in the participants list throw an alert and
    // only proceed if the user confirms he is aware and wishes to proceed anyways
    if(!this.checkUserParticipation(formatedParticipants)) {
      return;
    }

    // Gather info in one object
    const requestPayload = {
      trackId: selectedTrackId,
      reservationDate: selectedDate,
      sessions: mergedSessions,
      participants: formatedParticipants
    };
    this.sendCreateRequest(requestPayload);
  }

  formatAndMergeSessions(): { startTime: string, endTime: string }[] {
    const mergedSessions: { startTime: string, endTime: string }[] = [];

    // Sort the slots
    const selectedSlots = this.dateTimeSelectionFormGroup.get('selectedSlots')!.value;
    const sortedSlots = [...selectedSlots].sort((a: Slot, b: Slot) =>
      a.startTime.localeCompare(b.startTime)
    );

    // Check for consecutives and merge them
    for (const slot of sortedSlots) {
      const last = mergedSessions[mergedSessions.length - 1];

      if (last && last.endTime === slot.startTime) {
        // Extend the previous session
        last.endTime = slot.endTime;
      } else {
        // Start a new session
        mergedSessions.push({
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      }
    }
    return mergedSessions;
  }

  formatParticipants(): { userId: number; kartId: number; }[] {
    return this.participants.controls.map(participantGroup => ({
      userId: participantGroup.get('user')!.value.id,
      kartId: participantGroup.get('kart')!.value
    }));
  }

  checkUserParticipation(formatedParticipants: { userId: number; kartId: number; }[]): boolean {
    const currentUserId = this.authService.getCurrentUser()?.id;
    const userIsIncluded = formatedParticipants.some(p => p.userId === currentUserId);
    
    if(this.isEnterpriseView && userIsIncluded) {
      this.toastr.warning('You cannot include yourself in the participants list.');
      return false;
    } else if (!this.isEnterpriseView && !userIsIncluded) {
      this.toastr.warning('You must be included as a participant.');
      return false;
    }
    return true;
  }

  sendCreateRequest(requestPayload: any): void {
    this.reservationService.createReservation(requestPayload).subscribe({
      next: (reservation) => {
        this.toastr.success("Reservation successfully created!");
        this.router.navigate([`/reservations/${reservation.id}`]);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Failed to create reservation.");
      }
    });
  }


  // Helpers to fetch data from services

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: SimpleUser[]) => {
        if(users != null) {
          // Filter out current user only if in enterprise view
          const currentUserId = this.authService.getCurrentUser()?.id;
          this.users = this.isEnterpriseView
            ? users.filter(user => user.id !== currentUserId)
            : users;

        } else {
          this.toastr.warning("Error loading the users information", "Going back!");
          this.goBack();
        }
      },
      error: (err) => {
        console.error(err)
        this.toastr.warning("Error loading the users information", "Going back!");
        this.goBack();
      }
    });
  }

  loadTracks(): void {
    const trackObservable = this.isEnterpriseView
      ? this.trackService.getOwnedTracks()
      : this.trackService.getTracksCached();

    trackObservable.subscribe({
      next: (tracks: SimpleTrack[]) => {
        if(tracks !== null) {
          // Keep only available tracks
          this.tracks = tracks.filter(track => track.available);

          // Check if there is a track in router state and preselect it if found
          this.checkStateForSelectedTrack();

        } else {
          this.toastr.warning("Error loading the tracks information", "Going back!");
          this.goBack();
        }
      },
      error: (err) => {
        console.error(err)
        this.toastr.warning("Error loading the tracks information", "Going back!");
        this.goBack();
      }
    });
  }

  checkStateForSelectedTrack(): void {
    if (this.trackFromState) {
      const matchingTrack = this.tracks.find(t => t.id === this.trackFromState?.id);
      if (matchingTrack) {
        this.preselectTrack(matchingTrack);
      } else {
        this.toastr.warning("The track you're trying to use is not available", "Please select a different one.");
      }
    }
  }

  loadKarts(): void {
    this.kartService.getKartsAvailable(
      this.trackSelectionFormGroup.get('selectedTrack')?.value.id,
    ).subscribe({
      next: (karts: Kart[]) => {
        if(karts !== null) {
          this.karts = karts;
          this.groupKarts();
        } else {
          console.log("error loading karts: ", karts)
          // Restart from step 2
          this.toastr.warning("This track currently has no karts available", "Please select another track");
          this.resetDateTimeStep();
        }
      },
      error: (err) => {
        console.error("erorr loading karts", err);
        // Restart from step 1
        this.toastr.warning("Error fetching this track's available karts", "Please try again");
        this.stepper.reset();
      }
    });
  }

  groupKarts(): void {
    const groupedMap = new Map<string, Kart[]>();

    this.karts.forEach(kart => {
      if (!groupedMap.has(kart.model)) {
        groupedMap.set(kart.model, []);
      }
      groupedMap.get(kart.model)!.push(kart);
    });

    this.groupedKarts = Array.from(groupedMap.entries())
      .map(([model, karts]) => ({
        model,
        karts
      }));
  }

  loadSlots(): void {
    this.reservationService.getSlots(
      this.trackSelectionFormGroup.get('selectedTrack')?.value.id,
      this.formatedDate
    ).subscribe({
      next: (slots: Slot[]) => {
        if(slots != null) {
          this.slots = slots;
          this.slotDuration = this.getMinutesDifference(slots[0]);
        } else {
          console.log("error loading slots: ", slots)
          // Restart from step 2
          this.toastr.warning("There are no slots available for this date at this track", "Please select another date");
          this.resetDateTimeStep();
        }
      },
      error: (err) => {
        console.error("erorr loading slots", err);
        // Restart from step 1
        this.toastr.warning("Error fetching track availability", "Please try again");
        this.stepper.reset();
      }
    });
  }

  getMinutesDifference(slot: Slot): number {
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);

    return (eh * 60 + em) - (sh * 60 + sm);
  }

  formatTime(time: string): string {
    return time.slice(0, 5); // Assumes time format is 'HH:mm:ss'
  }

  goBack(): void {
    this.location.back();
  }
}
