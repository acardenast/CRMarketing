import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccionService } from '../../services/accion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-acciones-lista',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class AccionesListaComponent implements OnInit {

  acciones: any[] = [];
  cargando = true;
  error = '';
  isCliente = false;
  isEmpresa = false;
  isAdmin   = false;

  constructor(
    private accionService: AccionService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.isCliente = this.auth.isCliente();
    this.isEmpresa = this.auth.isEmpresa();
    this.isAdmin   = this.auth.isAdmin();
    this.cargarAcciones();
  }

  cargarAcciones() {
    this.cargando = true;
    this.accionService.getAcciones().subscribe({
      next: (data: any) => { this.acciones = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar las acciones'; this.cargando = false; }
    });
  }

  eliminarAccion(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta acción?')) {
      this.accionService.eliminarAccion(id).subscribe({
        next: () => this.cargarAcciones(),
        error: () => alert('Error al eliminar')
      });
    }
  }

  pagarAccion(accion: any) {
    const siguiente = accion.estado_pago === 'pendiente' ? 'en_proceso' : 'pagado';
    const msg = accion.estado_pago === 'pendiente'
      ? '¿Iniciar el proceso de pago?'
      : '✅ ¿Confirmar el pago definitivo?';
    if (confirm(msg)) {
      this.accionService.actualizarPago(accion.id, siguiente).subscribe({
        next: () => this.cargarAcciones(),
        error: () => alert('Error al actualizar el pago')
      });
    }
  }

  getIconoTipo(tipo: string): string {
    const map: any = { llamada:'📞', email:'📧', reunion:'🤝', campana:'📣', nota:'📝', chat:'💬', seguimiento:'🔔' };
    return map[tipo] || '⚡';
  }

  getClasePago(estado: string): string {
    const map: any = { pendiente:'pago-pendiente', en_proceso:'pago-proceso', pagado:'pago-pagado' };
    return map[estado] || '';
  }
}
