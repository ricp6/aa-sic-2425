import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../interfaces/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user'; // Creo q es esta

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('authToken'); // Asegúrate de guardar el token al iniciar sesión
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers });
  }
}
