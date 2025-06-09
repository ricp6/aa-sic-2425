import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../interfaces/user-profile';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  errorMessage = '';

  // Pestaña activa: 'stats' (Estatísticas) o 'password' (Alterar password)
  activeTab: 'stats' | 'password' = 'stats';

  // Datos del formulario de cambio de contraseña
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => this.user = data,
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMessage = 'No se pudo cargar el perfil del usuario.';
      }
    });
  }

  changePassword(): void {
    if (!this.passwordData.current || !this.passwordData.new || !this.passwordData.confirm) {
      alert("Please fill in all fields.");
      return;
    }

    if (this.passwordData.new !== this.passwordData.confirm) {
      alert("New passwords do not match.");
      return;
    }

    this.userService.changePassword(this.passwordData.current, this.passwordData.new).subscribe({
      next: (res) => {
        this.toastr.success(res?.message || "Password changed successfully", "Success");
        this.passwordData = { current: '', new: '', confirm: '' };
      },
      error: (err) => {
        console.error('Error changing password:', err);
        const errorMsg = typeof err.error === 'string'
          ? err.error
          : err.error?.message || "Failed to change password.";

        this.toastr.error(errorMsg, "Password Change Error");
      }
    });
  }


}
