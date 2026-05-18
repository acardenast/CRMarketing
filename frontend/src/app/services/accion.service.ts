import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Accion {
  id?: number;
  empresa_id: number;
  cliente_id: number;
  tipo: string;
  titulo?: string;
  descripcion?: string;
  estado: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  todo_el_dia?: boolean;
  metadata?: any;
  precio?: number;
  comision?: number;
  ingreso_neto?: number;
  estado_pago?: string;
  cliente?: any;
}

@Injectable({ providedIn: 'root' })
export class AccionService {
  constructor(private api: ApiService) {}

  getAcciones(): Observable<any>               { return this.api.get('acciones'); }
  getAccion(id: number): Observable<any>       { return this.api.get(`acciones/${id}`); }
  crearAccion(a: any): Observable<any>         { return this.api.post('acciones', a); }
  actualizarAccion(id: number, a: any): Observable<any> { return this.api.put('acciones', id, a); }
  eliminarAccion(id: number): Observable<any>  { return this.api.delete('acciones', id); }

  actualizarPago(id: number, estado_pago: string): Observable<any> {
    return this.api.patch(`acciones/${id}/pago`, { estado_pago });
  }

  getAccionesPorCliente(clienteId: number): Observable<any> {
  return this.api.get(`acciones?cliente_id=${clienteId}`);
}
}
