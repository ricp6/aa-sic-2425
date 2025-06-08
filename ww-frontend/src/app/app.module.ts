import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { EnterpriseHomeComponent } from './components/enterprise-home/enterprise-home.component';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';
import { RegisterComponent } from './components/register/register.component';
import { TrackDetailsComponent } from './components/track-details/track-details.component';
import { SessionDetailsComponent } from './components/session-details/session-details.component';


import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SessionsComponent,
    ReservationsComponent,
    ProfileComponent,
    NotificationsComponent,
    TracksComponent,
    EnterpriseHomeComponent,
    AuthWrapperComponent,
    RegisterComponent,
    TrackDetailsComponent,
    SessionDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      extendedTimeOut: 2000, //Time to close after a user hovers over toast
      positionClass: 'toast-top-left',
      progressBar: true,
      preventDuplicates: true
    }), // ToastrModule added
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true // multi: true means that HTTP_INTERCEPTORS is an array of providers
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
