import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Reservation, ReservationStatus } from '../interfaces/reservation';
import { TrackService} from "./track.service";
import { SimpleTrack } from '../interfaces/track';


interface RawReservation {
    id: number;
    reservationDateTime: string;
    status: string;
    trackId: number;
    trackName: string;
    sessions: { id: number; startTime: string; endTime: string }[];
    participants: { id: number; userId: number; userName: string; kartId: number; kartNumber: number }[];
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private readonly reservationsURL = 'http://localhost:8080/api/reservations';

    constructor(
        private readonly http: HttpClient,
        private readonly toastr: ToastrService,
        private readonly trackService: TrackService
    ) { }

    getReservations(): Observable<Reservation[]> {
        return combineLatest([
            this.http.get<RawReservation[]>(this.reservationsURL),
            this.trackService.loadTracks()
        ]).pipe(
            map(([rawReservations, tracks]) => {
                const mappedReservations = this.mapRawReservationsToReservations(rawReservations, tracks);

                mappedReservations.sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA);

                    const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                    const dateB = new Date(yearB, monthB - 1, dayB);

                    return dateA.getTime() - dateB.getTime();
                });

                return mappedReservations;
            }),
            catchError(this.handleError)
        );
    }

    private mapRawReservationsToReservations(rawReservations: RawReservation[], tracks: SimpleTrack[]): Reservation[] {
        return rawReservations.map(raw => {
            const reservationDate = new Date(raw.reservationDateTime);
            const date = reservationDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const numberOfParticipants = raw.participants.length;
            const numberOfSlots = raw.sessions.length.toString();

            const track = tracks.find(t => t.id === raw.trackId);
            const trackImage = track ? track.image : '/track1.jpg';

            return {
                id: raw.id,
                trackName: raw.trackName,
                numberOfParticipants: numberOfParticipants,
                date: date,
                numberOfSlots: numberOfSlots,
                status: raw.status as ReservationStatus,
                trackImage: trackImage
            };
        });
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 401) {
            this.toastr.warning('Session expired or unauthorized. Please log in again.', 'Authentication Required');
        } else if (error.status === 403) {
            this.toastr.warning('You don\'t have permission to perform this action', 'Permission required');
        } else {
            this.toastr.error('An error occurred while loading reservations', 'Server error');
        }
        return throwError(() => error);
    }
}
