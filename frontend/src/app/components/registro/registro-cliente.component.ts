import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

interface Empresa { id: number; nombre: string; }

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss']
})
export class RegistroClienteComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasCargando = true;

  form = {
    empresa_id: '',
    name: '', username: '', email: '', telefono: '',
    empresa_cliente: '',
    password: '', password_confirmation: ''
  };
  error = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Empresa[]>(`${environment.apiUrl}/public/empresas`).subscribe({
      next: (data) => { this.empresas = data; this.empresasCargando = false; },
      error: () => { this.empresasCargando = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.empresa_id) { this.error = 'Selecciona una empresa.'; return; }
    this.loading = true;
    this.error = '';
    this.http.post(`${environment.apiUrl}/auth/register/cliente`, this.form).subscribe({
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