import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  user:      AuthService['user'];
  isAdmin:   AuthService['isAdmin'];
  isEmpresa: AuthService['isEmpresa'];
  isCliente: AuthService['isCliente'];

  // Inicializado con false; se actualiza en el constructor una vez que
  // el entorno del navegador está disponible.
  isDark = signal(false);

  get themeLabel(): string {
    return this.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }

  constructor(public auth: AuthService) {
    this.user      = auth.user;
    this.isAdmin   = auth.isAdmin;
    this.isEmpresa = auth.isEmpresa;
    this.isCliente = auth.isCliente;

    // Acceso seguro a APIs del navegador (typeof guard para SSR/build)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('crm-theme');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      const theme = saved ?? (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      this.isDark.set(theme === 'dark');
    }
  }

  toggleTheme(): void {
    const next = this.isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crm-theme', next);
    }
    this.isDark.set(next === 'dark');
  }

  logout(): void { this.auth.logout(); }
}
