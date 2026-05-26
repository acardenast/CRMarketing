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

    this.auth.login(this.loginValue, this.password).subscribe({
      next: (res) => {
        this.loading.set(false);
        const rol = res.user.rol;
        if (rol === 'admin') this.router.navigate(['/empresas']);
        else                 this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciales incorrectas.');
      }
    });
  }
}
