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

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tracks', component: TracksComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
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
