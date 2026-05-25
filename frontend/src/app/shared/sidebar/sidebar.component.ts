import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const lucide: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  user: AuthService['user'];
  isAdmin:   AuthService['isAdmin'];
  isEmpresa: AuthService['isEmpresa'];
  isCliente: AuthService['isCliente'];

  currentTheme: 'light' | 'dark' = 'light';

  constructor(public auth: AuthService) {
    this.user      = auth.user;
    this.isAdmin   = auth.isAdmin;
    this.isEmpresa = auth.isEmpresa;
    this.isCliente = auth.isCliente;

    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('crm-theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.currentTheme = (saved === 'dark' || saved === 'light') ? (saved as 'dark' | 'light') : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  logout(): void { this.auth.logout(); }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    if (typeof localStorage !== 'undefined') localStorage.setItem('crm-theme', this.currentTheme);
    queueMicrotask(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  themeIcon(): string {
    return this.currentTheme === 'dark' ? 'sun' : 'moon';
  }

  themeLabel(): string {
    return this.currentTheme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro';
  }
}
