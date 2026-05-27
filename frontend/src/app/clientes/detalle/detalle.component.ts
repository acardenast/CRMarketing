import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { AccionService } from '../../services/accion.service';
import { AuthService } from '../../services/auth.service';
import { MensajeService, Mensaje } from '../../services/mensaje.service';

@Component({
  selector: 'app-clientes-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class ClientesDetalleComponent implements OnInit {

  cliente: any = null;
  acciones: any[] = [];
  cargando = true;
  error = '';
  tabActiva: 'resumen' | 'acciones' | 'chat' | 'calendario' = 'resumen';
  isCliente = false;
  isEmpresa = false;

  // Acciones
  mostrarFormAccion = false;
  nuevaAccion: any = {
    tipo: 'llamada', titulo: '', descripcion: '',
    fecha_inicio: '', estado: 'pendiente', precio: null
  };
  guardandoAccion = false;
  precioCalculado: any = null;

  // Chat inline
  mensajes: Mensaje[] = [];
  nuevoMensaje = '';
  enviandoMensaje = false;
  chatAccionId: number | null = null;
  cargandoMensajes = false;

  // Calendario
  mesActual: Date = new Date();
  diasCalendario: any[] = [];
  hoy = new Date();

  constructor(
    private clienteService: ClienteService,
    private accionService: AccionService,
    private auth: AuthService,
    private mensajeService: MensajeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isCliente = this.auth.isCliente();
    this.isEmpresa = this.auth.isEmpresa();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteService.getCliente(parseInt(id)).subscribe({
        next: (data: any) => { this.cliente = data; this.cargando = false; this.cargarAcciones(); },
        error: () => { this.error = 'No se pudo cargar el cliente'; this.cargando = false; }
      });
    }
  }

  cargarAcciones() {
    this.accionService.getAcciones().subscribe({
      next: (data: any) => {
        this.acciones = data.filter((a: any) => a.cliente_id === this.cliente.id);
        this.generarCalendario();
        // Si hay acciones con chat, preseleccionar la primera para el chat inline
        if (!this.chatAccionId && this.acciones.length > 0) {
          this.chatAccionId = this.acciones[0].id;
        }
      },
      error: () => {}
    });
  }

  cambiarTab(tab: 'resumen' | 'acciones' | 'chat' | 'calendario') {
    this.tabActiva = tab;
    if (tab === 'chat') {
      this.cargarMensajes();
    }
    if (tab === 'calendario') this.generarCalendario();
  }

  // ── CHAT INLINE ──
  cargarMensajes() {
    if (!this.chatAccionId) return;
    this.cargandoMensajes = true;
    this.mensajeService.getMensajes(this.chatAccionId).subscribe({
      next: (data: Mensaje[]) => { this.mensajes = data; this.cargandoMensajes = false; },
      error: () => { this.cargandoMensajes = false; }
    });
  }

  seleccionarAccionChat(accionId: number) {
    this.chatAccionId = accionId;
    this.cargarMensajes();
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.chatAccionId || this.enviandoMensaje) return;
    this.enviandoMensaje = true;
    this.mensajeService.enviarMensaje(this.chatAccionId, this.nuevoMensaje.trim()).subscribe({
      next: (m: Mensaje) => {
        this.mensajes = [...this.mensajes, m];
        this.nuevoMensaje = '';
        this.enviandoMensaje = false;
      },
      error: () => { this.enviandoMensaje = false; }
    });
  }

  irAChatCompleto() {
    this.router.navigate(['/chat/cliente', this.cliente.id]);
  }

  // ── PRECIO PREVIEW ──
  onPrecioChange() {
    if (this.nuevaAccion.tipo === 'campana' && this.nuevaAccion.precio > 0) {
      const p = parseFloat(this.nuevaAccion.precio);
      const user = this.auth.user();
      const plan = user?.empresa?.plan ?? 'basico';
      const porcentaje = plan === 'premium' ? 5 : 10;
      const comision = +(p * porcentaje / 100).toFixed(2);
      const neto = +(p - comision).toFixed(2);
      this.precioCalculado = { precio: p, comision, neto, porcentaje };
    } else {
      this.precioCalculado = null;
    }
  }

  // ── GUARDAR ACCIÓN ──
  guardarAccion() {
    this.guardandoAccion = true;
    const payload: any = {
      ...this.nuevaAccion,
      cliente_id: this.cliente.id,
      empresa_id: this.cliente.empresa_id
    };
    if (payload.tipo !== 'campana') { delete payload.precio; }
    this.accionService.crearAccion(payload).subscribe({
      next: () => {
        this.mostrarFormAccion = false;
        this.guardandoAccion = false;
        this.precioCalculado = null;
        this.nuevaAccion = { tipo: 'llamada', titulo: '', descripcion: '', fecha_inicio: '', estado: 'pendiente', precio: null };
        this.cargarAcciones();
      },
      error: () => { this.guardandoAccion = false; }
    });
  }

  eliminarAccion(id: number) {
    if (confirm('¿Eliminar esta acción?')) {
      this.accionService.eliminarAccion(id).subscribe({ next: () => this.cargarAcciones() });
    }
  }

  // ── PAGO (cliente) ──
  pagarAccion(accion: any) {
    const siguiente = accion.estado_pago === 'pendiente' ? 'en_proceso' : 'pagado';
    const msg = accion.estado_pago === 'pendiente'
      ? '¿Iniciar el proceso de pago?'
      : '✅ ¿Confirmar el pago? Esta acción no se puede deshacer.';
    if (confirm(msg)) {
      this.accionService.actualizarPago(accion.id, siguiente).subscribe({
        next: () => this.cargarAcciones(),
        error: () => alert('Error al actualizar el pago')
      });
    }
  }

  // ── CALENDARIO ──
  generarCalendario() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const offset = primerDia === 0 ? 6 : primerDia - 1;
    this.diasCalendario = [];
    for (let i = 0; i < offset; i++) this.diasCalendario.push(null);
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(año, mes, d);
      const accionesDia = this.acciones.filter(a => {
        if (!a.fecha_inicio) return false;
        const fa = new Date(a.fecha_inicio);
        return fa.getFullYear() === año && fa.getMonth() === mes && fa.getDate() === d;
      });
      this.diasCalendario.push({ dia: d, fecha, acciones: accionesDia });
    }
  }

  mesAnterior()  { this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1); this.generarCalendario(); }
  mesSiguiente() { this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1); this.generarCalendario(); }
  getNombreMes() { return this.mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }); }

  eliminar() {
    if (confirm('¿Seguro que quieres eliminar este cliente?')) {
      this.clienteService.eliminarCliente(this.cliente.id).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: () => alert('Error al eliminar')
      });
    }
  }

  getClaseEstado(estado: string): string {
    const m: any = { lead:'bg-yellow-100 text-yellow-800', contactado:'bg-blue-100 text-blue-800', negociacion:'bg-purple-100 text-purple-800', cliente:'bg-green-100 text-green-800', inactivo:'bg-gray-100 text-gray-700' };
    return m[estado] || 'bg-gray-100 text-gray-700';
  }

  getIconoTipo(tipo: string): string {
    const m: any = { llamada:'📞', email:'📧', reunion:'🤝', propuesta:'📄', seguimiento:'🔔', campana:'📣', nota:'📝', chat:'💬' };
    return m[tipo] || '⚡';
  }

  getClasePago(estado: string): string {
    const m: any = { pendiente:'pago-pendiente', en_proceso:'pago-proceso', pagado:'pago-pagado' };
    return m[estado] || '';
  }

  getMensajeClase(m: Mensaje): string {
    const user = this.auth.user();
    return m.usuario_id === user?.id ? 'msg-propio' : 'msg-otro';
  }
}
