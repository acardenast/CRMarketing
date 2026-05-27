import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Archivo {
  id: number;
  accion_id: number;
  cliente_id: number;
  usuario_id: number | null;
  nombre_original: string;
  mime_type: string;
  tamano: number;
  url: string;
  created_at: string;
  usuario?: any;
  accion?: any;
}

@Injectable({ providedIn: 'root' })
export class ArchivoService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' });
  }

  getArchivosPorAccion(accionId: number): Observable<Archivo[]> {
    return this.http.get<Archivo[]>(`${this.base}/acciones/${accionId}/archivos`, { headers: this.authHeaders() });
  }

  getArchivosPorCliente(clienteId: number, accionId?: number): Observable<Archivo[]> {
    const params = accionId ? `?accion_id=${accionId}` : '';
    return this.http.get<Archivo[]>(`${this.base}/clientes/${clienteId}/archivos${params}`, { headers: this.authHeaders() });
  }

  subirArchivo(accionId: number, file: File): Observable<Archivo> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' });
    const formData = new FormData();
    formData.append('archivo', file);
    return this.http.post<Archivo>(`${this.base}/acciones/${accionId}/archivos`, formData, { headers });
  }

  eliminarArchivo(id: number): Observable<any> {
    return this.http.delete(`${this.base}/archivos/${id}`, { headers: this.authHeaders() });
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  esImagen(mime: string): boolean {
    return mime.startsWith('image/');
  }

  icono(mime: string): string {
    if (mime.startsWith('image/')) return '\uD83D\uDDBC\uFE0F';
    if (mime === 'application/pdf') return '\uD83D\uDCC4';
    if (mime.includes('word') || mime.includes('document')) return '\uD83D\uDCDD';
    if (mime.includes('excel') || mime.includes('sheet')) return '\uD83D\uDCCA';
    if (mime.includes('zip') || mime.includes('rar') || mime.includes('7z')) return '\uD83D\uDDC2\uFE0F';
    if (mime.startsWith('video/')) return '\uD83C\uDFA5';
    if (mime.startsWith('audio/')) return '\uD83C\uDFA7';
    return '\uD83D\uDCC1';
  }
}
