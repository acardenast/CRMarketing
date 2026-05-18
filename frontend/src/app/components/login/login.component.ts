import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginValue = '';
  password   = '';
  error      = signal('');
  loading    = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.loginValue || !this.password) {
      this.error.set('Rellena todos los campos.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    // Intenta los tres roles en orden hasta que uno funcione
    this.tryLogin(['admin', 'empresa', 'cliente'], 0);
  }

  private tryLogin(roles: string[], index: number): void {
    if (index >= roles.length) {
      this.loading.set(false);
      this.error.set('Credenciales incorrectas.');
      return;
    }

    this.auth.login(this.loginValue, this.password, roles[index]).subscribe({
      next: (res) => {
        this.loading.set(false);
        const rol = res.user.rol;
        if (rol === 'admin')    this.router.navigate(['/empresas']);
        else if (rol === 'empresa') this.router.navigate(['/dashboard']);
        else                        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Si falla ese rol, prueba el siguiente
        this.tryLogin(roles, index + 1);
      }
    });
  }
}
