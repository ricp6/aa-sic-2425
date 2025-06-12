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
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


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
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'tracks', component: TracksComponent },
  { path: 'tracks/:id', component: TrackDetailsComponent },

  { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'reservations/form', component: ReservationFormComponent, canActivate: [AuthGuard] },
  { path: 'reservations/:id', component: ReservationDetailsComponent, canActivate: [AuthGuard] },
  // { path: 'reservations/form/:id', component: ReservationFormComponent, canActivate: [AuthGuard] },

  { path: 'sessions', component: SessionsComponent, canActivate: [AuthGuard] },
  { path: 'sessions/:id', component: SessionDetailsComponent, canActivate: [AuthGuard] },

  { path: 'enterprise', redirectTo: 'enterprise/home' },
  { 
    path: 'enterprise/home', 
    component: EnterpriseHomeComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'OWNER' } 
  },
  { 
    path: 'enterprise/tracks', 
    component: EnterpriseHomeComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'OWNER' } 
  },
  { 
    path: 'enterprise/reservations', 
    component: EnterpriseHomeComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'OWNER' } 
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
