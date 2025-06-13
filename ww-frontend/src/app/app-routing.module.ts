import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';
import { RegisterComponent } from './components/register/register.component';
import {TrackDetailsComponent} from "./components/track-details/track-details.component";
import {SessionDetailsComponent} from "./components/session-details/session-details.component";
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


const routes: Routes = [

  // OPEN TO EVERYONE, SEEN AS CLIENT VIEW
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      { 
        path: 'login', 
        component: LoginComponent, 
        data: { view: 'client' }  
      },
      { 
        path: 'register', 
        component: RegisterComponent, 
        data: { view: 'client' }  
      },
      { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    data: { view: 'client' }
  },
  { 
    path: 'tracks', 
    component: TracksComponent, 
    data: { view: 'client' } 
  },
  { 
    path: 'tracks/:id', 
    component: TrackDetailsComponent, 
    data: { view: 'client' }
  },

  // AUTHORIZATION REQUIRED, SEEN AS CLIENT VIEW
  { 
    path: 'reservations', 
    component: ReservationsComponent, 
    canActivate: [AuthGuard], 
    data: { view: 'client' }
  },
  {
    path: 'reservations/form',
    component: ReservationFormComponent,
    canActivate: [AuthGuard], 
    data: { view: 'client' } 
  },
  { 
    path: 'reservations/:id', 
    component: ReservationDetailsComponent, 
    canActivate: [AuthGuard],
    data: { view: 'client' }
  },
  // { path: 'reservations/form/:id', component: ReservationFormComponent, canActivate: [AuthGuard] },

  { 
    path: 'sessions', 
    component: SessionsComponent, 
    canActivate: [AuthGuard], 
    data: { view: 'client' }
  },
  { 
    path: 'sessions/:id', 
    component: SessionDetailsComponent, 
    canActivate: [AuthGuard], 
    data: { view: 'client' }
  },

  // AUTHORIZATION AND OWNER ACCOUNT REQUIRED, SEEN AS ENTERPRISE VIEW
  { 
    path: 'enterprise', 
    redirectTo: 'enterprise/tracks'
  },
  { 
    path: 'enterprise/tracks', 
    component: TracksComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { view: 'enterprise' } 
  },
  { 
    path: 'enterprise/tracks/:id', 
    component: TrackDetailsComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { view: 'enterprise' }
  },
  { 
    path: 'enterprise/reservations/form', 
    component: ReservationFormComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { view: 'enterprise' } 
  },

  // AUTHORIZATION REQUIRED, CAN BE SEEN AS BOTH VIEWS
  { 
    path: 'notifications', 
    component: NotificationsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard]
  },

  // DEFAULT ROUTES
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
