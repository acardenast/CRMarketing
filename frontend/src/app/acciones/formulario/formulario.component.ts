import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AccionService } from '../../services/accion.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-acciones-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class AccionesFormularioComponent implements OnInit {

  accion: any = {
    cliente_id: null,
    empresa_id: null,
    tipo: 'llamada',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    resultado: '',
    precio: null,
    estado_pago: 'pendiente'
  };

  clientes: any[] = [];
  esEdicion = false;
  accionId: number = 0;
  guardando = false;
  error = '';
  precioCalculado: any = null;
  planEmpresa: string = 'basico';

  constructor(
    private accionService: AccionService,
    private clienteService: ClienteService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Leer plan de la empresa del usuario logueado
    const user = this.auth.user();
    this.planEmpresa = user?.empresa?.plan ?? 'basico';

    this.clienteService.getClientes().subscribe({
      next: (data: any) => { this.clientes = data; },
      error: (err: any) => console.error('Error cargando clientes:', err)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.accionId = parseInt(id);
      this.cargarAccion(this.accionId);
    }
  }

  cargarAccion(id: number) {
    this.accionService.getAccion(id).subscribe({
      next: (data: any) => { this.accion = data; this.onPrecioChange(); },
      error: () => { this.error = 'No se pudo cargar la acción'; }
    });
  }

  seleccionarCliente(clienteId: number) {
    const cliente = this.clientes.find((c: any) => c.id == clienteId);
    if (cliente) this.accion.empresa_id = cliente.empresa_id;
  }

  onPrecioChange() {
    if (this.accion.tipo === 'campana' && this.accion.precio > 0) {
      const p = parseFloat(this.accion.precio);
      const porcentaje = this.planEmpresa === 'premium' ? 0.05 : 0.10;
      const comision = +(p * porcentaje).toFixed(2);
      const neto = +(p - comision).toFixed(2);
      this.precioCalculado = { precio: p, comision, neto, porcentaje: porcentaje * 100 };
    } else {
      this.precioCalculado = null;
    }
  }

  guardar() {
    this.guardando = true;
    this.error = '';
    const payload = { ...this.accion };
    if (payload.tipo !== 'campana') {
      delete payload.precio;
      delete payload.estado_pago;
    }
    if (this.esEdicion) {
      this.accionService.actualizarAccion(this.accionId, payload).subscribe({
        next: () => this.router.navigate(['/acciones']),
        error: () => { this.error = 'Error al actualizar la acción'; this.guardando = false; }
      });
    } else {
      this.accionService.crearAccion(payload).subscribe({
        next: () => this.router.navigate(['/acciones']),
        error: () => { this.error = 'Error al crear la acción'; this.guardando = false; }
      });
    }
  }
}
