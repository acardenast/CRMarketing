import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss']
})
export class RegistroEmpresaComponent {
  form = {
    nombre_empresa: '', email_empresa: '', telefono_empresa: '', plan: 'basico',
    name: '', username: '', email: '', telefono: '',
    password: '', password_confirmation: ''
  };
  error   = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.http.post('/api/auth/register/empresa', this.form).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.loading = false;
        const errors = err?.error?.errors;
        this.error = errors
          ? Object.values(errors).flat().join(' ')
          : (err?.error?.message || 'Error al registrar.');
      }
    });
  }
}
