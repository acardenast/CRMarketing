import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Empresa {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  plan: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private api: ApiService) {}

  getEmpresas(): Observable<any> {
    return this.api.get('empresas');
  }

  getEmpresa(id: number): Observable<any> {
    return this.api.get(`empresas/${id}`);
  }

  crearEmpresa(empresa: any): Observable<any> {
    return this.api.post('empresas', empresa);
  }

  actualizarEmpresa(id: number, empresa: any): Observable<any> {
    return this.api.put('empresas', id, empresa);
  }

  eliminarEmpresa(id: number): Observable<any> {
    return this.api.delete('empresas', id);
  }
}
