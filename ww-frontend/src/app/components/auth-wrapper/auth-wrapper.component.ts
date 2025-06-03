import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.css'
})
export class AuthWrapperComponent {

  showPassword: boolean = false;

  constructor() {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  requestEnterprise(): void {
    alert("Not implemented!");
  }
}
