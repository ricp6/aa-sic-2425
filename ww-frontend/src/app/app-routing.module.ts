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

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tracks', component: TracksComponent },
  { path: 'tracks/:id', component: TrackDetailsComponent },
  { path: 'sessionsDetails/:id', component: SessionDetailsComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'enterprise',
    children: [
      { path: 'home', component: EnterpriseHomeComponent },
      { path: 'tracks', component: EnterpriseHomeComponent },
      { path: 'reservations', component: EnterpriseHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
