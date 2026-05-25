import { Component } from '@angular/core';
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
  user: AuthService['user'];
  isAdmin:   AuthService['isAdmin'];
  isEmpresa: AuthService['isEmpresa'];
  isCliente: AuthService['isCliente'];

  constructor(public auth: AuthService) {
    this.user      = auth.user;
    this.isAdmin   = auth.isAdmin;
    this.isEmpresa = auth.isEmpresa;
    this.isCliente = auth.isCliente;

    // Restore theme on load
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }

  logout(): void { this.auth.logout(); }

  toggleTheme(): void {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' ||
      (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', next);
  }
}
