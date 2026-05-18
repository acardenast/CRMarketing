import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Mensaje {
  id: number;
  accion_id: number;
  usuario_id: number | null;
  cliente_id: number;
  mensaje: string;
  tipo: string;
  leido: boolean;
  fecha_lectura: string | null;
  created_at: string;
  usuario?: any;
  cliente?: any;
}

@Injectable({ providedIn: 'root' })
export class MensajeService {
  constructor(private api: ApiService) {}

  getMensajes(accionId: number): Observable<Mensaje[]> {
    return this.api.get(`acciones/${accionId}/mensajes`);
  }

  enviarMensaje(accionId: number, mensaje: string): Observable<Mensaje> {
    return this.api.post(`acciones/${accionId}/mensajes`, { mensaje });
  }
}