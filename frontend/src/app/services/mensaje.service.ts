import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Mensaje {
  id: number;
  accion_id: number;
  usuario_id: number | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
  archivo_url?: string;
  archivo_nombre?: string;
  usuario?: { id: number; name: string; rol: string };
  cliente?: { id: number; nombre: string };
}

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' });
  }

  getMensajes(accionId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.base}/acciones/${accionId}/mensajes`, { headers: this.headers() });
  }

  enviarMensaje(accionId: number, mensaje: string, archivoUrl?: string, archivoNombre?: string): Observable<Mensaje> {
    const body: any = { mensaje };
    if (archivoUrl)    body.archivo_url    = archivoUrl;
    if (archivoNombre) body.archivo_nombre = archivoNombre;
    return this.http.post<Mensaje>(`${this.base}/acciones/${accionId}/mensajes`, body, { headers: this.headers() });
  }
}
