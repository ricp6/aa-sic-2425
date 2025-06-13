import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService, 
  ) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (user && user.userType === 'OWNER') {
      return true;
    }

    this.toastr.warning("This page requires an enterprise account.", "Access denied!");
    this.router.navigate(['/home']);
    return false;
  }
}