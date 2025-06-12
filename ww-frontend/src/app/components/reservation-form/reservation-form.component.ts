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
import { SimpleTrack } from '../../interfaces/track';
import { Slot } from '../../interfaces/slot';
import { Kart } from '../../interfaces/kart';
import { SimpleUser } from '../../interfaces/user';
import { format } from 'date-fns';


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
      .map((slot: Slot) => `${slot.startTime} - ${slot.endTime}`)
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
  }


  // --- Step 1: Track Selection ---

  displayTrackFn(track: SimpleTrack): string {
    return track ? `${track.name} (${track.address})` : '';
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
    const userIsIncluded = formatedParticipants.some(p => p.userId === this.authService.getCurrentUser()?.id);
    if (!userIsIncluded) {
      const proceed = confirm("You are not listed as a participant in this reservation. Do you want to continue?");
      if (!proceed) {
        return false; // User not included and dont want to proceed with the request
      }
    }
    return true; // User included or wants to proceed without being included
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
    this.trackService.getTracksCached().subscribe({
      next: (tracks) => {
        if(tracks !== null) {
          // Keep only available tracks
          this.tracks = tracks.filter(track => track.available);
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
    // this.loadKartsMocks();
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

  loadKartsMocks(): void {
    this.karts = [
      { id: 1, kartNumber: 4, model: "super fast" },
      { id: 2, kartNumber: 6, model: "super fast" },
      { id: 3, kartNumber: 14, model: "goat" },
      { id: 4, kartNumber: 81, model: "champchamp" },
      { id: 5, kartNumber: 55, model: "super fast" },
    ]
    this.groupKarts();
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
    // this.loadSlotsMocks();
    console.log(this.selectedDate)
    console.log(this.formatedDate)
    this.reservationService.getSlots(
      this.trackSelectionFormGroup.get('selectedTrack')?.value.id,
      this.formatedDate // e.g. '2025-06-03'
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

  loadSlotsMocks(): void {
    this.slots = [
      { startTime: "10:00", endTime: "10:20", available: true },
      { startTime: "10:20", endTime: "10:40", available: true },
      { startTime: "10:40", endTime: "11:00", available: false },
      { startTime: "11:00", endTime: "11:20", available: true },
      { startTime: "11:20", endTime: "11:40", available: true },
      { startTime: "11:40", endTime: "12:00", available: false },
      { startTime: "12:00", endTime: "12:20", available: false },
      { startTime: "12:20", endTime: "12:40", available: true },
      { startTime: "12:40", endTime: "13:00", available: true },
      { startTime: "13:00", endTime: "13:20", available: true },
      { startTime: "13:20", endTime: "13:40", available: true },
    ]
  }
  
  goBack(): void {
    this.location.back();
  }
}