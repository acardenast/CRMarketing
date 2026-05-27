import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  ingresosEmpresa: any = null;
  ultimasAcciones: any[] = [];
  proximasAcciones: any[] = [];
  clientesPorEstado: any[] = [];
  empresasRecientes: any[] = [];
  clientes: any[] = [];
  empresas: any[] = [];
  clienteSeleccionado: number | null = null;
  empresaSeleccionada: number | null = null;
  cargando = true;
  today = new Date();
  error = '';

  isAdmin   = false;
  isEmpresa = false;
  isCliente = false;

  constructor(
    private dashboardService: DashboardService,
    private clienteService: ClienteService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin   = this.auth.isAdmin();
    this.isEmpresa = this.auth.isEmpresa();
    this.isCliente = this.auth.isCliente();

    if (this.isEmpresa) {
      this.clienteService.getClientes().subscribe({
        next: (data: any) => this.clientes = data,
        error: () => {}
      });
    }
    if (this.isAdmin) {
      this.clienteService.getEmpresas().subscribe({
        next: (data: any) => this.empresas = data,
        error: () => {}
      });
    }
    this.cargarDatos();
  }

  cargarDatos() {
    const cid = this.clienteSeleccionado || undefined;
    const eid = this.empresaSeleccionada || undefined;

    this.dashboardService.getStats(this.isAdmin ? eid : undefined).subscribe({
      next: (data: any) => { this.stats = data; },
      error: () => this.error = 'No se pudieron cargar las estadísticas'
    });

    if (this.isEmpresa) {
      this.dashboardService.getIngresosEmpresa(cid).subscribe({
        next: (data: any) => { this.ingresosEmpresa = data; },
        error: () => {}
      });
    }

    if (this.isAdmin || this.isEmpresa) {
      this.dashboardService.getUltimasAcciones(this.isAdmin ? undefined : cid, eid).subscribe({
        next: (data: any) => this.ultimasAcciones = data,
        error: () => {}
      });
    }

    if (this.isAdmin) {
      this.dashboardService.getEmpresasRecientes().subscribe({
        next: (data: any) => { this.empresasRecientes = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else if (this.isEmpresa) {
      this.dashboardService.getClientesPorEstado().subscribe({
        next: (data: any) => { this.clientesPorEstado = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else if (this.isCliente) {
      this.dashboardService.getProximasAcciones().subscribe({
        next: (data: any) => { this.proximasAcciones = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    }
  }

  filtrar() {
    this.cargarDatos();
  }

  limpiarFiltro() {
    this.clienteSeleccionado = null;
    this.empresaSeleccionada = null;
    this.cargarDatos();
  }

  getIconoTipo(tipo: string): string {
    const map: any = { llamada:'📞', email:'📧', reunion:'🤝', propuesta:'📄', seguimiento:'🔔', nota:'📝', chat:'💬', campana:'📣' };
    return map[tipo] || '⚡';
  }

  getClaseEstado(estado: string): string {
    const map: any = { pendiente:'est-pendiente', en_progreso:'est-progreso', completada:'est-completada', cancelada:'est-cancelada' };
    return map[estado] || '';
  }

  getClasePago(estado: string): string {
    const map: any = { pendiente:'pago-pendiente', en_proceso:'pago-proceso', pagado:'pago-pagado' };
    return map[estado] || '';
  }

  getNombreCliente(): string {
    if (!this.clienteSeleccionado) return '';
    const c = this.clientes.find((x: any) => x.id == this.clienteSeleccionado);
    return c ? c.nombre : '';
  }

  getNombreEmpresa(): string {
    if (!this.empresaSeleccionada) return '';
    const e = this.empresas.find((x: any) => x.id == this.empresaSeleccionada);
    return e ? e.nombre : '';
  }
}
