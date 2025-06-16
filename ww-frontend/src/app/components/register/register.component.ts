import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthWrapperComponent } from '../auth-wrapper/auth-wrapper.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../auth-wrapper/auth-wrapper.component.css']
})
export class RegisterComponent extends AuthWrapperComponent {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {
    super();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(): void {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/auth/login'])
          this.toastr.success('Your account was successfully created!', 'Welcome ' + this.form.get('name')?.value + '. Please log in.');
        }
      });
    }
  }
}