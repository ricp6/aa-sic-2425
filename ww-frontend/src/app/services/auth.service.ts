import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { TokenResponse, User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authURL = "http://localhost:8080/api/auth";

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  user$: Observable<User | null> = this.userSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  refreshToken$: Observable<string | null> = this.refreshTokenSubject.asObservable();

  constructor(
    private readonly router: Router,
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
    return this.http.post<User>(this.authURL + '/login', data).pipe(
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
          this.toastr.warning('Bad credentials.', 'Authentication error');
        } else if (error.status === 403) {
          this.toastr.warning('You dont have permission to execute this action', 'Permission required');
        } else {
          this.toastr.error('An error occurred while processing the login.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  // Simplified refreshAccessToken - only makes the refresh API call and stores the token
  refreshAccessToken(): Observable<TokenResponse> {
    // console.log("enter refresh token")
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // If no refresh token, immediately fail and logout
      // console.warn("No refresh token found. Logging out.");
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http.post<TokenResponse>(
      `${this.authURL}/refresh-token`, // Corrected URL interpolation
      {}, // Empty body as refresh token is in header
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      }
    ).pipe(
      tap(response => {
        if (response && response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.tokenSubject.next(response.accessToken); // Update token subject

          // Optional: If you also get a new refresh token, store it here
          // if (response.refreshToken) {
          //   localStorage.setItem('refreshToken', response.refreshToken);
          // }

          // Update the user object with the new token if it's stored there
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            const updatedUser: User = { ...currentUser, token: response.accessToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.userSubject.next(updatedUser);
          }
          // console.log('AuthService: Access token refreshed successfully.');
        } else {
          // console.log('AuthService: Refresh token response missing accessToken:')
          // console.error(response)
          this.logout(); // Logout if refresh response is malformed
          throw new Error('Invalid refresh token response.');
        }
      }),
      catchError(error => {
        // console.log('AuthService: Error refreshing token:')
        // console.error(error)
        // This is the point where the refresh API call *itself* failed.
        // This usually means the refresh token is expired or invalid.
        this.logout(); // Log out the user if refresh token fails
        return throwError(() => error); // Propagate the error
      })
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(this.authURL + '/register', data).pipe(
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
    localStorage.removeItem('refreshToken');
    // Clear subjects
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    // Redirect to login page
    this.router.navigate(["auth/login"]);
    // console.log('AuthService: User logged out.');
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
