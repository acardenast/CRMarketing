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
  }

  logout(): void { this.auth.logout(); }
}
