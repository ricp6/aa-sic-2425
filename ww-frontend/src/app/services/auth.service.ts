import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authURL = "http://localhost:8080/api/auth/";

  private readonly userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<User>(this.authURL + 'login', data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<User>(this.authURL + 'register', data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
