import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MensajeService, Mensaje } from '../services/mensaje.service';
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
  cargando = true;
  enviando = false;
  error = '';
  private polling!: Subscription;
  private debeScroll = true;

  constructor(
    private route: ActivatedRoute,
    private mensajeService: MensajeService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.accionId = Number(this.route.snapshot.paramMap.get('accionId'));
    this.cargarMensajes();

    // Polling cada 5 segundos para simular tiempo real
    this.polling = interval(5000).pipe(
      switchMap(() => this.mensajeService.getMensajes(this.accionId))
    ).subscribe({
      next: (data) => { this.mensajes = data; }
    });
  }

  ngOnDestroy() {
    this.polling?.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.debeScroll) this.scrollAbajo();
  }

  cargarMensajes() {
    this.cargando = true;
    this.mensajeService.getMensajes(this.accionId).subscribe({
      next: (data) => {
        this.mensajes = data;
        this.cargando = false;
        this.debeScroll = true;
      },
      error: () => {
        this.error = 'No se pudieron cargar los mensajes';
        this.cargando = false;
      }
    });
  }

  enviar() {
    const texto = this.textoNuevo.trim();
    if (!texto || this.enviando) return;

    this.enviando = true;
    this.mensajeService.enviarMensaje(this.accionId, texto).subscribe({
      next: (msg) => {
        this.mensajes.push(msg);
        this.textoNuevo = '';
        this.enviando = false;
        this.debeScroll = true;
      },
      error: () => {
        alert('Error al enviar el mensaje');
        this.enviando = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  esAdmin(msg: Mensaje): boolean {
  return msg.usuario?.rol === 'admin';
  }
  
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