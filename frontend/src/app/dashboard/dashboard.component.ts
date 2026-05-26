import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

declare const lucide: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: any = null;
  empresas: any[] = [];
  clientes: any[] = [];
  empresasRecientes: any[] = [];
  clientesPorEstado: any[] = [];
  ultimasAcciones: any[] = [];
  empresaSeleccionada: any = null;
  clienteSeleccionado: any = null;
  today = new Date();

  isAdmin   = false;
  isEmpresa = false;
  isCliente = false;

  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin   = this.auth.isAdmin();
    this.isEmpresa = this.auth.isEmpresa();
    this.isCliente = this.auth.isCliente();
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
  }

  cargarDatos(): void {
    const empresaId = this.empresaSeleccionada ? +this.empresaSeleccionada : undefined;
    const clienteId = this.clienteSeleccionado ? +this.clienteSeleccionado : undefined;

    // Stats: siempre necesarias para todos los roles
    this.dashboardService.getStats(empresaId).subscribe({
      next: (data: any) => {
        this.stats    = data;
        this.empresas = data?.empresas || [];
        this.clientes = data?.clientes || [];
        setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
      },
      error: (err: any) => console.error('Stats error:', err)
    });

    // Últimas acciones: solo admin y empresa
    if (this.isAdmin || this.isEmpresa) {
      this.dashboardService.getUltimasAcciones(clienteId, empresaId).subscribe({
        next: (data: any) => this.ultimasAcciones = data || [],
        error: () => {}
      });
    }

    // Empresas recientes: solo admin
    if (this.isAdmin) {
      this.dashboardService.getEmpresasRecientes().subscribe({
        next: (data: any) => this.empresasRecientes = data || [],
        error: () => {}
      });
    }

    // Clientes por estado: solo empresa
    if (this.isEmpresa) {
      this.dashboardService.getClientesPorEstado().subscribe({
        next: (data: any) => this.clientesPorEstado = data || [],
        error: () => {}
      });
    }

    // Próximas acciones: solo cliente
    if (this.isCliente) {
      this.dashboardService.getProximasAcciones(clienteId).subscribe({
        next: (data: any) => this.ultimasAcciones = data || [],
        error: () => {}
      });
    }
  }

  filtrar(): void { this.cargarDatos(); }

  limpiarFiltro(): void {
    this.empresaSeleccionada = null;
    this.clienteSeleccionado = null;
    this.cargarDatos();
  }

  getIconoTipo(tipo: string): string {
    const map: Record<string, string> = {
      llamada:     'phone',
      email:       'mail',
      reunion:     'calendar',
      propuesta:   'file-text',
      seguimiento: 'bell',
      nota:        'pencil',
      chat:        'message-square',
      campana:     'megaphone'
    };
    return map[tipo] ?? 'activity';
  }

  getClaseEstado(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'est-pendiente',
      en_progreso: 'est-progreso',
      completada:  'est-completada',
      cancelada:   'est-cancelada'
    };
    return map[estado] ?? '';
  }

  getClasePago(estado: string): string {
    const map: Record<string, string> = {
      pendiente:  'pago-pendiente',
      en_proceso: 'pago-proceso',
      pagado:     'pago-pagado'
    };
    return map[estado] ?? '';
  }

  getNombreEmpresa(): string {
    const e = this.empresas.find((x: any) => x.id == this.empresaSeleccionada);
    return e ? e.nombre : '';
  }

  getNombreCliente(): string {
    const c = this.clientes.find((x: any) => x.id == this.clienteSeleccionado);
    return c ? c.nombre : '';
  }
}
