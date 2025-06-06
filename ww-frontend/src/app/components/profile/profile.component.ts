import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../interfaces/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // 🔧 era `styleUrl` (corregido a plural)
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => this.user = data,
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMessage = 'No se pudo cargar el perfil del usuario.';
      }
    });
  }
}
