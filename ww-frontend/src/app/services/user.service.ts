import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userURL = "http://localhost:8080/api/users";

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {}

  addFavorite(trackId: number): Observable<void> {
    return this.http.put<void>(`${this.userURL}/favorites/${trackId}`, {}).pipe(
      tap(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          user.favoriteTrackIds.push(trackId);
          this.authService.updateUser(user);
        }
      })
    );
  }

  removeFavorite(trackId: number): Observable<void> {
    return this.http.delete<void>(`${this.userURL}/favorites/${trackId}`).pipe(
      tap(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          user.favoriteTrackIds = user.favoriteTrackIds.filter(id => id !== trackId);
          this.authService.updateUser(user);
        }
      })
    );
  }

}
