// src/app/components/reservation-form/reservation-form.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
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


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  // Form Groups for each step
  trackSelectionFormGroup!: FormGroup;
  dateTimeSelectionFormGroup!: FormGroup;
  participantsKartsFormGroup!: FormGroup;

  tracks: SimpleTrack[] = [];
  filteredTracks!: Observable<SimpleTrack[]>;

  slots: Slot[] = [];

  constructor(
    private readonly location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
    private readonly trackService: TrackService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFormGroups();

    // Load tracks list
    this.trackService.getAll().subscribe({
      next: (tracks) => {
        if(tracks !== null) {
          // Save tracks list
          this.tracks = tracks;
          
          // Set the filtered tracks observable
          this.filteredTracks = this.trackSelectionFormGroup.get('selectedTrack')!.valueChanges.pipe(
            startWith(''),
            map(track => {
              const name = typeof track === 'string' ? track : track?.name;
              return name ? this.filterTracks(name as string) : this.tracks.slice();
            }),
          );
        } else {
          this.toastr.warning("Error loading the tracks information", "Going back!");
          this.goBack();
        }
      },
      error: (err) => {
        this.toastr.warning("Error loading the tracks information", "Going back!");
        this.goBack();
      }
    });

    // Add initial participant (the authenticated user)
    // this.addCurrentUserAsParticipant();

    // Setup filtering for user emails (if you implement user search)

  }

  createFormGroups(): void {
    this.trackSelectionFormGroup = this.formBuilder.group({
      selectedTrack: ['', [Validators.required]]
    });

    this.dateTimeSelectionFormGroup = this.formBuilder.group({
      selectedDate: [null, Validators.required],
      selectedSlot: ['', Validators.required],
      // This will store selected session details including price for DTO
      selectedSessionDetails: [null, Validators.required]
    });

    // this.participantsKartsFormGroup = this.formBuilder.group({
    //   participants: this.formBuilder.array([], Validators.required)
    // });
  }

  goBack(): void {
    this.location.back();
  }

  resetStepper(): void {
    // Reset all form groups
    this.trackSelectionFormGroup.reset();
    this.dateTimeSelectionFormGroup.reset();
    // this.participantsKartsFormGroup.reset();

    // Reset additional state
    this.slots = [];
    this.trackSelectionFormGroup.get('selectedTrack')?.setValue('');
    this.dateTimeSelectionFormGroup.get('selectedDate')?.setValue(null);
    this.dateTimeSelectionFormGroup.get('selectedSlot')?.setValue('');

    // Go back to step 0
    this.stepper.reset();
    this.stepper.selectedIndex = 0;
  }


  // --- Step 1: Track Selection ---

  displayTrackFn(track: SimpleTrack): string {
    return track ? `${track.name} (${track.address})` : '';
  }

  private filterTracks(query: string): SimpleTrack[] {
    const filterValue = this.normalize(query);

    return this.tracks.filter(track => {
      const normalizedName = this.normalize(track.name);
      const normalizedAddress = this.normalize(track.address);
      return normalizedName.includes(filterValue) || normalizedAddress.includes(filterValue);
    });
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD') // decompose letters and diacritics (acentos/til/...)
      .replace(/[\u0300-\u036f]/g, ''); // remove diacritics
  }


  // --- Step 2: Date and Time Selection ---
  
  onDateSelected(): void {
    const selectedDate: Date = this.dateTimeSelectionFormGroup.get('selectedDate')?.value;
    const selectedTrack: SimpleTrack = this.trackSelectionFormGroup.get('selectedTrack')?.value;

    if (selectedTrack != null && selectedDate != null) {
      // Load the occupied slots for the selected track and day
      this.loadSlots(selectedTrack, selectedDate);
    } else {
      this.toastr.warning("Error loading track availability for the selected day", "Please try again");
      this.resetStepper();
    }
  }

  loadSlots(selectedTrack: SimpleTrack, selectedDate: Date): void {
    this.reservationService.getSlots(
      selectedTrack.id,
      selectedDate.toISOString().split('T')[0] // e.g. '2025-06-03'
    ).subscribe({
      next: (slots) => {
        if(slots !== null) {
          this.slots = slots;
        } else {
          this.toastr.warning("Error fetching track availability", "Please try again");
          this.resetStepper();
        }
      },
      error: (err) => {
        this.toastr.warning("Error fetching track availability", "Please try again");
        this.resetStepper();
      }
    });
  }

  // When a slot is selected, store its full details for the DTO
  onSlotSelected(slot: Slot): void {
    // this.dateTimeSelectionFormGroup.get('selectedSessionDetails')?.setValue({
    //   startTime: slot.startTime,
    //   endTime: slot.endTime,
    //   slotPrice: slot.price
    // });
  }



  // --- Step 3: Participants and Karts ---
  // get participants(): FormArray {
  //   return this.participantsKartsFormGroup.get('participants') as FormArray;
  // }

  // addCurrentUserAsParticipant(): void {
  //   const currentUser = this.authService.getCurrentUser();
  //   if (currentUser) {
  //     const existingParticipant = this.participants.controls.find(
  //       (control: AbstractControl) => control.get('userEmail')?.value === currentUser.email
  //     );

  //     if (!existingParticipant) {
  //       this.participants.push(this.formBuilder.group({
  //         userEmail: [currentUser.email, [Validators.required, Validators.email]],
  //         userName: [currentUser.name, Validators.required], // Display name
  //         kartNumber: ['', Validators.required],
  //         isCurrentUser: [true] // Flag for the authenticated user
  //       }));
  //     }
  //   } else {
  //     // If no current user, add an empty participant slot
  //     this.addParticipant();
  //   }
  // }

  // addParticipant(): void {
  //   if (this.participants.length < 10) { // Max 10 participants
  //     const participantGroup = this.formBuilder.group({
  //       userEmail: ['', [Validators.required, Validators.email]],
  //       userName: [''], // Will be filled based on email search, or left blank for new user
  //       kartNumber: ['', Validators.required],
  //       isCurrentUser: [false]
  //     });

  //     // Listen for email changes to potentially update userName (mock lookup)
  //     participantGroup.get('userEmail')?.valueChanges.pipe(
  //       debounceTime(400),
  //       distinctUntilChanged()
  //     ).subscribe(email => {
  //       const foundUser = this.mockUsers.find(u => u.email === email);
  //       if (foundUser) {
  //         participantGroup.get('userName')?.setValue(foundUser.name);
  //       } else {
  //         // If email doesn't match an existing user, keep name empty or allow typing
  //         participantGroup.get('userName')?.setValue('');
  //       }
  //     });

  //     this.participants.push(participantGroup);
  //   } else {
  //     this.toastr.warning('Maximum of 10 participants reached.');
  //   }
  // }

  // removeParticipant(index: number): void {
  //   const participantControl = this.participants.at(index);
  //   if (participantControl.get('isCurrentUser')?.value) {
  //     this.toastr.error('The authenticated user cannot be removed from the reservation.');
  //     return;
  //   }
  //   this.participants.removeAt(index);
  //   this.toastr.info('Participant removed.');
  // }

  // // --- Filtering users for autocomplete (if you implement it) ---
  // private _filterUsers(value: string | MockUser): MockUser[] {
  //   const filterValue = (typeof value === 'string' ? value : value.email).toLowerCase();
  //   return this.mockUsers.filter(user => user.email.toLowerCase().includes(filterValue));
  // }

  // get emailControls(): FormArray {
  //   return this.participantsKartsFormGroup.get('participants') as FormArray;
  // }

  // displayUserFn(user: MockUser): string {
  //   return user ? user.name : '';
  // }


  // --- Final Submission ---
  // submitReservation(): void {
  //   if (this.trackSelectionFormGroup.invalid || this.dateTimeSelectionFormGroup.invalid || this.participantsKartsFormGroup.invalid) {
  //     this.toastr.error('Please complete all required fields in the reservation form.', 'Form Invalid');
  //     // Optionally touch all controls to show errors
  //     this.trackSelectionFormGroup.markAllAsTouched();
  //     this.dateTimeSelectionFormGroup.markAllAsTouched();
  //     this.participantsKartsFormGroup.markAllAsTouched();
  //     return;
  //   }

  //   const trackId = this.trackSelectionFormGroup.get('selectedTrack')?.value.id;
  //   const selectedDate: Date = this.dateTimeSelectionFormGroup.get('selectedDate')?.value;
  //   const sessionDetails = this.dateTimeSelectionFormGroup.get('selectedSessionDetails')?.value;

  //   const reservationDateTime = new Date(selectedDate);
  //   // Set time using hours and minutes from sessionDetails.startTime (e.g., "10:00")
  //   const [hours, minutes] = sessionDetails.startTime.split(':').map(Number);
  //   reservationDateTime.setHours(hours);
  //   reservationDateTime.setMinutes(minutes);
  //   reservationDateTime.setSeconds(0);
  //   reservationDateTime.setMilliseconds(0);

  //   // Construct ReservationCreateRequestDTO
  //   const reservationRequest: ReservationCreateRequestDTO = {
  //     trackId: trackId,
  //     reservationDateTime: reservationDateTime.toISOString(), // ISO 8601 string for backend
  //     sessions: [
  //       { // Assuming one session per reservation for simplicity based on slot selection
  //         startTime: sessionDetails.startTime,
  //         endTime: sessionDetails.endTime,
  //         slotPrice: sessionDetails.slotPrice
  //       }
  //     ],
  //     participants: this.participants.controls.map(participantControl => ({
  //       kartNumber: participantControl.get('kartNumber')?.value,
  //       userEmail: participantControl.get('userEmail')?.value
  //     }))
  //   };

  //   console.log('Submitting Reservation:', reservationRequest);

  //   this.reservationService.createReservation(reservationRequest).subscribe({
  //     next: (response: ReservationResponseDTO) => {
  //       this.toastr.success('Reservation created successfully!', 'Success');
  //       console.log('Reservation created:', response);
  //       // Optionally reset form or navigate away
  //       this.stepper.reset();
  //       this.participants.clear(); // Clear old participants
  //       this.addCurrentUserAsParticipant(); // Add current user again
  //     },
  //     error: (err) => {
  //       // Error handled by ReservationService.handleError and ToastrService
  //       console.error('Error creating reservation:', err);
  //     }
  //   });
  // }

  // Helper for datetime conversion (optional, if you need more complex formatting)
  // formatDateTimeForBackend(date: Date, time: string): string {
  //   const [hours, minutes] = time.split(':').map(Number);
  //   date.setHours(hours, minutes, 0, 0);
  //   return date.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
  // }
}