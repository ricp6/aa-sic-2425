import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthWrapperComponent } from '../auth-wrapper/auth-wrapper.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../auth-wrapper/auth-wrapper.component.css']
})
export class LoginComponent extends AuthWrapperComponent {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    super();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error('Login failed', err)
      });
    }
  }
}