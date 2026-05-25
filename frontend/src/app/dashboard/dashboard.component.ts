import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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

  get isAdmin()   { return this.auth.isAdmin(); }
  get isEmpresa() { return this.auth.isEmpresa(); }
  get isCliente() { return this.auth.isCliente(); }

  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  ngOnInit(): void    { this.cargarDatos(); }
  ngAfterViewInit(): void {
    setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
  }

  cargarDatos(): void {
    const empresaId  = this.empresaSeleccionada  ? +this.empresaSeleccionada  : undefined;
    const clienteId  = this.clienteSeleccionado  ? +this.clienteSeleccionado  : undefined;

    forkJoin({
      stats:          this.dashboardService.getStats(empresaId),
      acciones:       this.dashboardService.getUltimasAcciones(clienteId, empresaId),
      porEstado:      this.dashboardService.getClientesPorEstado(),
      recientes:      this.dashboardService.getEmpresasRecientes(),
    }).subscribe({
      next: (res: any) => {
        this.stats             = res.stats;
        this.empresas          = res.stats?.empresas          || [];
        this.clientes          = res.stats?.clientes          || [];
        this.empresasRecientes = res.recientes                || [];
        this.clientesPorEstado = res.porEstado                || [];
        this.ultimasAcciones   = res.acciones                 || [];
        setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 0);
      },
      error: (err: any) => console.error('Dashboard error:', err)
    });
  }

  filtrar():      void { this.cargarDatos(); }
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
