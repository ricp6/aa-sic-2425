// src/app/interceptors/jwt.interceptor.ts (create this new file)
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // If a token exists and the request is to our API (not a third-party API), clone the request
    // and add the Authorization header.
    // Avoid sending token to login/register endpoints
    if (token && !request.url.includes('auth/login') && !request.url.includes('auth/register')
      && !request.url.includes('tracks/all') && !request.url.includes('tracks/:id')) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}