import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que representa un cliente
export interface Cliente {
  id?: number;
  empresa_id: number;
  nombre: string;
  email: string;
  telefono?: string;
  empresa_cliente?: string;
  estado: string;
  notas?: string;
  fecha_contacto?: string;
  empresa?: any;
  acciones?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private api: ApiService) {}

  getClientes(): Observable<any> {
    return this.api.get('clientes');
  }

  getCliente(id: number): Observable<any> {
    return this.api.get(`clientes/${id}`);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.api.post('clientes', cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.api.put('clientes', id, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.api.delete('clientes', id);
  }

  getEmpresas(): Observable<any> {
    return this.api.get('empresas');
  }
}
