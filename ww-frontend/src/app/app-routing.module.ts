import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EnterpriseHomeComponent } from './components/enterprise-home/enterprise-home.component';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';
import { RegisterComponent } from './components/register/register.component';
import {TrackDetailsComponent} from "./components/track-details/track-details.component";
import {SessionDetailsComponent} from "./components/session-details/session-details.component";
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  { path: 'home', component: HomeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'tracks', component: TracksComponent },
  { path: 'tracks/:id', component: TrackDetailsComponent },

  { path: 'reservations', component: ReservationsComponent },
  { path: 'reservations/:id', component: ReservationDetailsComponent },
  { path: 'reservations/form', component: ReservationFormComponent },
  { path: 'reservations/form/:id', component: ReservationFormComponent },

  { path: 'sessions', component: SessionsComponent },
  { path: 'sessions/:id', component: SessionDetailsComponent },

  { path: 'enterprise', component: EnterpriseHomeComponent },
  { path: 'enterprise/home', component: EnterpriseHomeComponent },
  { path: 'enterprise/tracks', component: EnterpriseHomeComponent },
  { path: 'enterprise/reservations', component: EnterpriseHomeComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
