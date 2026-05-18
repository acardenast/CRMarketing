import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  rol: 'admin' | 'empresa' | 'cliente';
  activo: boolean;
  empresa_id: number | null;
  cliente_id: number | null;
  empresa?: any;
  cliente?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'crm_token';
  private readonly USER_KEY  = 'crm_user';

  private _user = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  readonly user    = this._user.asReadonly();
  readonly token   = this._token.asReadonly();
  readonly isAuth  = computed(() => !!this._token());
  readonly isAdmin  = computed(() => this._user()?.rol === 'admin');
  readonly isEmpresa = computed(() => this._user()?.rol === 'empresa');
  readonly isCliente = computed(() => this._user()?.rol === 'cliente');

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  login(login: string, password: string, rol: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>('/api/auth/login', { login, password, rol })
      .pipe(tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      }));
  }

  logout(): void {
    const token = this._token();
    if (token) {
      this.http.post('/api/auth/logout', {}).subscribe({ error: () => {} });
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  me(): Observable<User> {
    return this.http.get<User>('/api/auth/me')
      .pipe(tap(u => {
        this._user.set(u);
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
      }));
  }

  hasRole(...roles: string[]): boolean {
    const rol = this._user()?.rol;
    return !!rol && roles.includes(rol);
  }
}
