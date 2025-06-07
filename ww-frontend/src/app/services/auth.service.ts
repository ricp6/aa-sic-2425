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

  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {
    // Save the session, helps in development but change before going to production
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(data: { email: string; password: string }) {
    return this.http.post<User>(this.authURL + 'login', data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.toastr.success('Your login was successful!', 'Welcome ' + user.name);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.warning('Invalid credentials.', 'Authentication error');
        } else {
          this.toastr.error('An error occoured while processing the login.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<User>(this.authURL + 'register', data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.toastr.success('Your account was successfully created!', 'Welcome ' + user.name);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toastr.warning(error.error ?? 'Invalid data given.', 'Registration error');
        } else {
          this.toastr.error('An error occoured while processing the registration.', 'Server error');
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  updateUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
