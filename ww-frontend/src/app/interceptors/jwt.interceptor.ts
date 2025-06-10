import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token &&
        !request.url.includes('auth/login') &&
        !request.url.includes('auth/register') &&
        !request.url.includes('tracks/all') &&
        !request.url.includes('tracks/all') &&
        !RegExp(/\/tracks\/\d+$/).exec(request.url) && // Exclude track details like /tracks/123
        !request.url.includes('auth/refresh-token')) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        // Check if it's a 403 (Forbidden) and a refresh token exists
        if (error.status === 403 && this.authService.getRefreshToken()) {
          // Try to refresh the token
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new token
              const newToken = this.authService.getToken();
              const cloned = request.clone({ 
                setHeaders: { Authorization: `Bearer ${newToken}` } 
              });

              return next.handle(cloned).pipe(
                catchError(retryError => {
                  console.error(retryError);
                  // If the retried request also fails (e.g., another 403),
                  // Do NOT try to refresh again. Force the log out.
                  if (retryError.status === 403) {
                    this.authService.logout();
                  }
                  return throwError(() => retryError);
                })
              );
            }),
            catchError(refreshError => {
              // The logout is already handled by authService.refreshAccessToken()
              return throwError(() => refreshError); 
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}