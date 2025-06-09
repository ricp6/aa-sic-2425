import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authURL = "http://localhost:8080/api/auth/";

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);

  user$: Observable<User | null> = this.userSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {
    // Load stored user and token on service initialization
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.userSubject.next(user);
    }
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(this.authURL + 'login', data).pipe(
      tap((user) => {
        // Store objects
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        // Set subjects
        this.userSubject.next(user);
        this.tokenSubject.next(user.token);
        // Notify user
        this.toastr.success('Your login was successful!', 'Welcome ' + user.name);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Invalid credentials.', 'Authentication error');
        } else {
          this.toastr.error('An error occurred while processing the login.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(this.authURL + 'register', data).pipe(
      tap(() => {
        this.toastr.success('Your account was successfully created!', 'Welcome ' + data.name + '. Please log in.');
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toastr.warning(error.error ?? 'Invalid data given.', 'Registration error');
        } else {
          this.toastr.error('An error occurred while processing the registration.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    // Clear storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Clear subjects
    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  isLoggedIn(): boolean {
    // A user is considered logged in if both user data and a JWT token exist.
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  updateUser(user: User): void {
    // When updating user, ensure token is preserved if it's not part of the update payload.
    // If user object contains a new token, update it. Otherwise, keep existing.
    const currentToken = this.getToken();
    const updatedUser: User = { ...user, token: user.token || currentToken || '' }; // Preserve token if not in update
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (updatedUser.token) {
        localStorage.setItem('token', updatedUser.token);
        this.tokenSubject.next(updatedUser.token);
    }
    this.userSubject.next(updatedUser);
  }
}
