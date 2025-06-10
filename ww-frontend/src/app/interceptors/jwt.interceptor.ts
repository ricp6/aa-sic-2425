import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  // Flag to prevent multiple concurrent refresh token requests
  private isRefreshing = false;
  // Subject to emit the new access token to queued requests
  private readonly refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    // console.log("intercepted request: ", request.url);
    
    if (token &&
        !request.headers.has('Authorization') && // Only set if not already present
        !request.url.includes('auth/login') &&
        !request.url.includes('auth/register') &&
        !request.url.includes('auth/refresh-token') &&
        !request.url.includes('tracks/all') &&
        !RegExp(/\/tracks\/\d+$/).exec(request.url) // Exclude track details like /tracks/123
      ) {

      // console.log("adding token to headers")
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log("Interceptor: Request failed. Status:", error.status, "URL:", request.url);
        // console.error(error);

        // Check if the error is 401 
        // AND the message indicates an invalid/expired token 
        // AND we have a refresh token
        // AND it's not already a refresh token request itself
        
        if (error.status === 401 &&
            error.error.message &&
            error.error.message === "Authentication required or token is invalid/expired." &&
            this.authService.getRefreshToken() != null &&
            !request.url.includes('auth/refresh-token')) {

          // console.log("entered if")
          // If a refresh is already in progress, queue this request
          if (this.isRefreshing) {
            // console.log("Interceptor: Token refresh in progress. Queuing request.");
            return this.refreshTokenSubject.pipe(
              filter(token => token !== null), // Wait until a new token is emitted
              take(1), // Take only one value (the new token)
              switchMap((newToken) => {
                // Once new token is available, retry the original request with the new token
                const clonedRequest = request.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                console.log("Interceptor: Retrying queued request with new token.");
                return next.handle(clonedRequest);
              })
            );
          } else {
            // This is the first 401 for this batch of concurrent requests.
            // Initiate the refresh process.
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null); // Clear previous token, signaling refresh is ongoing

            // console.log("Interceptor: Initial 401. Attempting token refresh.");

            return this.authService.refreshAccessToken().pipe(
              switchMap(response => {
                // Token refresh was successful!
                this.isRefreshing = false; // Reset flag
                // Emit the new access token so queued requests can proceed
                this.refreshTokenSubject.next(response.accessToken);

                // Now, retry the original request with the new token
                const newToken = response.accessToken;
                const clonedRequest = request.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                // console.log("Interceptor: Token refreshed. Retrying original request.");
                return next.handle(clonedRequest); // This is the **single retry** of the original request
              }),
              catchError(refreshError => {
                // The refresh token request itself failed (e.g., refresh token expired)
                this.isRefreshing = false; // Reset flag
                this.refreshTokenSubject.next(null); // Clear subject
                // console.error("Interceptor: Refresh token failed. Logging out (handled by AuthService).", refreshError);
                // The AuthService.logout() is already called within AuthService.refreshAccessToken's catchError.
                return throwError(() => refreshError); // Propagate the refresh error
              })
            );
          }
        }

        // For any other errors (not 401, no refresh token, or refresh token request itself),
        // or if the retried request ultimately fails, simply re-throw the error.
        // This means no further refresh attempts for this particular request failure.
        // The component that initiated the request will receive this error.
        // console.log("Interceptor: Error not handled by refresh logic. Propagating original error.");
        return throwError(() => error);
      })
    );
  }
}