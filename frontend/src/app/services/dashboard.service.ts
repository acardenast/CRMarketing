import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getStats(): Observable<any> { return this.api.get('dashboard/stats'); }

  getUltimasAcciones(clienteId?: number, empresaId?: number): Observable<any> {
    const params = new URLSearchParams();
    if (clienteId) params.append('cliente_id', clienteId.toString());
    if (empresaId) params.append('empresa_id', empresaId.toString());
    const qs = params.toString();
    return this.api.get(`dashboard/ultimas-acciones${qs ? '?' + qs : ''}`);
  }

  getProximasAcciones(clienteId?: number): Observable<any> {
    const params = clienteId ? `?cliente_id=${clienteId}` : '';
    return this.api.get(`dashboard/proximas-acciones${params}`);
  }

  getClientesPorEstado(): Observable<any>  { return this.api.get('dashboard/clientes-estado'); }
  getEmpresasRecientes(): Observable<any>  { return this.api.get('dashboard/empresas-recientes'); }

  getIngresosAdmin(clienteId?: number): Observable<any> {
    const params = clienteId ? `?cliente_id=${clienteId}` : '';
    return this.api.get(`dashboard/ingresos-admin${params}`);
  }

  getIngresosEmpresa(clienteId?: number): Observable<any> {
    const params = clienteId ? `?cliente_id=${clienteId}` : '';
    return this.api.get(`dashboard/ingresos-empresa${params}`);
  }
}
