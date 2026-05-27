import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MensajeService, Mensaje } from '../services/mensaje.service';
import { ArchivoService } from '../services/archivo.service';
import { AuthService } from '../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('mensajesBox') mensajesBox!: ElementRef;

  accionId!: number;
  mensajes: Mensaje[] = [];
  textoNuevo = '';
  archivoAdjunto: File | null = null;
  cargando = true;
  enviando = false;
  error = '';
  private polling!: Subscription;
  private debeScroll = true;

  constructor(
    private route: ActivatedRoute,
    private mensajeService: MensajeService,
    private archivoService: ArchivoService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.accionId = Number(this.route.snapshot.paramMap.get('accionId'));
    this.cargarMensajes();
    this.polling = interval(5000).pipe(
      switchMap(() => this.mensajeService.getMensajes(this.accionId))
    ).subscribe({
      next: (data) => { this.mensajes = data; }
    });
  }

  ngOnDestroy() { this.polling?.unsubscribe(); }

  ngAfterViewChecked() { if (this.debeScroll) this.scrollAbajo(); }

  cargarMensajes() {
    this.cargando = true;
    this.mensajeService.getMensajes(this.accionId).subscribe({
      next: (data) => { this.mensajes = data; this.cargando = false; this.debeScroll = true; },
      error: () => { this.error = 'No se pudieron cargar los mensajes'; this.cargando = false; }
    });
  }

  seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.archivoAdjunto = input.files[0];
  }

  quitarAdjunto() { this.archivoAdjunto = null; }

  enviar() {
    const texto = this.textoNuevo.trim();
    if ((!texto && !this.archivoAdjunto) || this.enviando) return;
    this.enviando = true;

    if (this.archivoAdjunto) {
      // Subir archivo primero, luego enviar mensaje con referencia
      this.archivoService.subirArchivo(this.accionId, this.archivoAdjunto).subscribe({
        next: (archivo) => {
          const mensajeTexto = texto || `📎 ${archivo.nombre_original}`;
          this.mensajeService.enviarMensaje(this.accionId, mensajeTexto, archivo.url, archivo.nombre_original).subscribe({
            next: (msg) => {
              this.mensajes.push(msg);
              this.textoNuevo = '';
              this.archivoAdjunto = null;
              this.enviando = false;
              this.debeScroll = true;
            },
            error: () => { alert('Error al enviar'); this.enviando = false; }
          });
        },
        error: () => { alert('Error al subir el archivo'); this.enviando = false; }
      });
    } else {
      this.mensajeService.enviarMensaje(this.accionId, texto).subscribe({
        next: (msg) => {
          this.mensajes.push(msg);
          this.textoNuevo = '';
          this.enviando = false;
          this.debeScroll = true;
        },
        error: () => { alert('Error al enviar el mensaje'); this.enviando = false; }
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  esAdmin(msg: Mensaje): boolean { return msg.usuario?.rol === 'admin'; }

  esMio(msg: Mensaje): boolean {
    const user = this.auth.user();
    if (!user) return false;
    if (user.rol === 'cliente') return msg.usuario_id === null;
    return msg.usuario_id === user.id;
  }

  nombreRemitente(msg: Mensaje): string {
    if (msg.usuario_id === null) return msg.cliente?.nombre || 'Cliente';
    if (msg.usuario?.rol === 'admin') return '🛡️ Admin · ' + (msg.usuario?.name || 'Admin');
    return msg.usuario?.name || 'Empresa';
  }

  scrollAbajo() {
    try {
      const el = this.mensajesBox.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.debeScroll = false;
    } catch {}
  }
}
