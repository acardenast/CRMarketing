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

  isDark = signal(this.detectDark());

  get themeLabel(): string {
    return this.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }

  constructor(public auth: AuthService) {
    this.user      = auth.user;
    this.isAdmin   = auth.isAdmin;
    this.isEmpresa = auth.isEmpresa;
    this.isCliente = auth.isCliente;

    // Aplica preferencia guardada al arrancar
    const saved = localStorage.getItem('crm-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      this.isDark.set(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      this.isDark.set(prefersDark);
    }
  }

  toggleTheme(): void {
    const next = this.isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('crm-theme', next);
    this.isDark.set(next === 'dark');
  }

  logout(): void { this.auth.logout(); }

  private detectDark(): boolean {
    const saved = localStorage.getItem('crm-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
