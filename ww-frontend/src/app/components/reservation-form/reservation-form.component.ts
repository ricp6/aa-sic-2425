// src/app/components/reservation-form/reservation-form.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { SimpleTrack } from '../../interfaces/track';
import { Observable } from 'rxjs';
import { TrackService } from '../../services/track.service';
import { Location } from '@angular/common';
import { Slot } from '../../interfaces/slot';
import { MatCalendar } from '@angular/material/datepicker';
import { KartService } from '../../services/kart.service';
import { Kart } from '../../interfaces/kart';
import { SimpleUser } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  // Form Groups for each step
  trackSelectionFormGroup!: FormGroup;
  dateTimeSelectionFormGroup!: FormGroup;
  participantsKartsFormGroup!: FormGroup;

  tracks: SimpleTrack[] = [];
  filteredTracks!: Observable<SimpleTrack[]>;
  karts: Kart[] = [];
  
  selectedDate: Date | null = null;
  slots: Slot[] = [];
  slotDuration: number = 0;
  
  users: SimpleUser[] = []
  filteredUsers!: Observable<SimpleUser[]>;
  groupedKarts: { model: string; karts: Kart[] }[] = [];
 
  goBack(): void {
    this.location.back();
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
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFormGroups();

    // Setup data filtering observables
    this.setTracksFiltering();

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

      // Check for duplicate users
      if (seenUserIds.has(user.id)) {
        return { duplicateUser: true };
      }
      seenUserIds.add(user.id);

      // Check for duplicate karts
      if (seenKartIds.has(kart)) {
        return { duplicateKart: true };
      }
      seenKartIds.add(kart);
    }

    return null;
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
    // Reset date-time form controls
    this.dateTimeSelectionFormGroup.get('selectedSlots')?.setValue([]);
    // Reset state vars
    this.selectedDate = null;
    this.slots = [];
    this.slotDuration = 0;
  }

  resetParticipantsStep(): void {
    // Reset all kart controls
    this.participants.controls.forEach((participantGroup: AbstractControl) => {
      participantGroup.get('kart')?.reset(null);
    });
    this.participantsKartsFormGroup.updateValueAndValidity();
  }


  // --- Step 1: Track Selection ---

  displayTrackFn(track: SimpleTrack): string {
    return track ? `${track.name} (${track.address})` : '';
  }

  onTrackSelected(): void {
    // Clear next steps if this one changed
    this.resetDateTimeStep();
    // Load karts available for the track
    this.loadKarts();
  }

  
  // --- Step 2: Date and Time Selection ---
  
  onDateSelected(): void {
    if (this.selectedDate == null) {
      // Start from step 1
      this.toastr.warning("Error loading track availability for the selected day", "Please try again");
      this.stepper.reset();
    }
    // Load the occupied slots for the selected track and day
    this.loadSlots();
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

  get participants() {
    return this.participantsKartsFormGroup.get('participants') as FormArray;
  }

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
    } else {
      this.toastr.warning('This track currently has no karts available to host more participants.', 
        `Maximum of ${this.karts.length} participants reached.`);
    }
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }



  // --- Final Submission ---
  submitReservation(): void {
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
  
    const selectedTrack = this.trackSelectionFormGroup.get('selectedTrack')!.value;
    const selectedDate  = this.selectedDate.toISOString().split("T")[0]; // format date
    const selectedSlots = this.dateTimeSelectionFormGroup.get('selectedSlots')!.value;
    
    // Format sessions
    const sessions = selectedSlots.map((slot: Slot) => ({
      startTime: slot.startTime, // assume in 'HH:mm:ss' or 'HH:mm'
      endTime: slot.endTime      // same format
    }));
    
    // Participants
    const participants = this.participants.controls.map(participantGroup => ({
      userId: participantGroup.get('user')!.value.id,
      kartId: participantGroup.get('kart')!.value
    }));
    
    // If the current user is not in the participants list throw an alert and 
    // only proceed if the user confirms he is aware and wishes to proceed anyways
    const userIsIncluded = participants.some(p => p.userId === this.authService.getCurrentUser()?.id);
    if (!userIsIncluded) {
      const proceed = confirm("You are not listed as a participant in this reservation. Do you want to continue?");
      if (!proceed) {
        return;
      }
    }

    const requestPayload = {
      trackId: selectedTrack.id,
      reservationDate: selectedDate,
      sessions: sessions,
      participants: participants
    };
    
    this.reservationService.createReservation(requestPayload).subscribe({
      next: () => {
        this.toastr.success("Reservation successfully created!");
        this.router.navigate(['/reservations']);
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
      next: (users) => {
        if(users != null) {
          this.users = users;
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
    this.trackService.getAll().subscribe({
      next: (tracks) => {
        if(tracks !== null) {
          this.tracks = tracks;
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

  loadKarts(): void {
    this.kartService.getKartsAvailable(
      this.trackSelectionFormGroup.get('selectedTrack')?.value.id,
    ).subscribe({
      next: (karts) => {
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
    // Assuming `availableKarts` is already populated
    const groupedMap = new Map<string, Kart[]>();

    this.karts.forEach(kart => {
      if (!groupedMap.has(kart.model)) {
        groupedMap.set(kart.model, []);
      }
      groupedMap.get(kart.model)!.push(kart);
    });

    this.groupedKarts = Array.from(groupedMap.entries()).map(([model, karts]) => ({
      model,
      karts
    }));
  }

  loadSlots(): void {
    this.reservationService.getSlots(
      this.trackSelectionFormGroup.get('selectedTrack')?.value.id,
      this.selectedDate!.toISOString().split('T')[0] // e.g. '2025-06-03'
    ).subscribe({
      next: (slots) => {
        if(slots != null) {
          this.slots = slots;
          this.slotDuration = ~slots[0].endTime - ~slots[0].startTime;  
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
}