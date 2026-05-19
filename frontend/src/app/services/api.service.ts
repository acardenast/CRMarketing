import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() });
  }

  post(endpoint: string, datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, datos, { headers: this.getHeaders() });
  }

  put(endpoint: string, id: number, datos: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}/${id}`, datos, { headers: this.getHeaders() });
  }

  patch(endpoint: string, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${endpoint}`, datos, { headers: this.getHeaders() });
  }

  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`, { headers: this.getHeaders() });
  }
}
