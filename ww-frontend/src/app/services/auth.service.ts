import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { TokenResponse, User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authURL = "http://localhost:8080/api/auth/";

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  user$: Observable<User | null> = this.userSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  refreshToken$: Observable<string | null> = this.refreshTokenSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {
    // Load stored user and token on service initialization
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.userSubject.next(user);
    }
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
    if (storedRefreshToken) {
      this.refreshTokenSubject.next(storedRefreshToken);
    }
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(this.authURL + 'login', data).pipe(
      tap((user) => {
        // Store objects
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        localStorage.setItem('refreshToken', user.refreshToken);
        // Set subjects
        this.userSubject.next(user);
        this.tokenSubject.next(user.token);
        this.refreshTokenSubject.next(user.refreshToken);
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

  refreshAccessToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<TokenResponse>(
      this.authURL + 'refresh-token',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` }
      }
    ).pipe(
      tap(response => {
        console.log("new token in the house")
        localStorage.setItem('token', response.accessToken);
        this.tokenSubject.next(response.accessToken);
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        // Perform logout if refresh fails
        this.logout();
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
  
  getRefreshToken(): string | null {
    return this.refreshTokenSubject.getValue();
  }

  isLoggedIn(): boolean {
    // A user is considered logged in if both user data and the tokens exist.
    return this.getCurrentUser() !== null 
        && this.getToken() !== null
        && this.getRefreshToken() !== null;
  }

  updateUser(user: User): void {
    // When updating user, ensure tokens are preserved if it's not part of the update payload.
    // If user object contains a new token, update it. Otherwise, keep existing.
    const currentToken = this.getToken();
    const currentRefreshToken = this.getRefreshToken();
    const updatedUser: User = { 
      ...user, 
      token: user.token ?? currentToken ?? '', 
      refreshToken : user.refreshToken ?? currentRefreshToken ?? '' 
    }; // Preserve tokens if not in update

    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (updatedUser.token) {
        localStorage.setItem('token', updatedUser.token);
        this.tokenSubject.next(updatedUser.token);
    }
    if (updatedUser.refreshToken) {
        localStorage.setItem('refreshToken', updatedUser.refreshToken);
        this.refreshTokenSubject.next(updatedUser.refreshToken);
    }
    this.userSubject.next(updatedUser);
  }
}
