import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './services/auth.guard';

import { LandingComponent }             from './landing/landing.component';
import { LoginComponent }               from './components/login/login.component';
import { RegistroEmpresaComponent }     from './components/registro/registro-empresa.component';
import { RegistroClienteComponent }     from './components/registro/registro-cliente.component';
import { DashboardComponent }           from './dashboard/dashboard.component';
import { EmpresasListaComponent }       from './empresas/lista/lista.component';
import { EmpresasFormularioComponent }  from './empresas/formulario/formulario.component';
import { EmpresasDetalleComponent }     from './empresas/detalle/detalle.component';
import { ClientesListaComponent }       from './clientes/lista/lista.component';
import { ClientesFormularioComponent }  from './clientes/formulario/formulario.component';
import { ClientesDetalleComponent }     from './clientes/detalle/detalle.component';
import { AccionesListaComponent }       from './acciones/lista/lista.component';
import { AccionesFormularioComponent }  from './acciones/formulario/formulario.component';
import { ChatComponent }                from './chat/chat.component';
import { ChatClienteComponent }         from './chat-cliente/chat-cliente.component';

export const routes: Routes = [
  // Landing pública
  { path: '', component: LandingComponent },

  // Rutas públicas (sin navbar)
  { path: 'login',              component: LoginComponent },
  { path: 'registro/empresa',   component: RegistroEmpresaComponent },
  { path: 'registro/cliente',   component: RegistroClienteComponent },

  // Rutas protegidas
  { path: 'dashboard',           component: DashboardComponent,           canActivate: [authGuard] },

  { path: 'empresas',            component: EmpresasListaComponent,       canActivate: [authGuard, roleGuard('admin')] },
  { path: 'empresas/nueva',      component: EmpresasFormularioComponent,  canActivate: [authGuard, roleGuard('admin')] },
  { path: 'empresas/editar/:id', component: EmpresasFormularioComponent,  canActivate: [authGuard, roleGuard('admin')] },
  { path: 'empresas/:id',        component: EmpresasDetalleComponent,     canActivate: [authGuard, roleGuard('admin')] },

  { path: 'clientes',            component: ClientesListaComponent,       canActivate: [authGuard, roleGuard('admin','empresa')] },
  { path: 'clientes/nuevo',      component: ClientesFormularioComponent,  canActivate: [authGuard, roleGuard('admin','empresa')] },
  { path: 'clientes/editar/:id', component: ClientesFormularioComponent,  canActivate: [authGuard, roleGuard('admin','empresa')] },
  { path: 'clientes/:id',        component: ClientesDetalleComponent,     canActivate: [authGuard, roleGuard('admin','empresa')] },

  { path: 'acciones',            component: AccionesListaComponent,       canActivate: [authGuard, roleGuard('admin','empresa','cliente')] },
  { path: 'acciones/nueva',      component: AccionesFormularioComponent,  canActivate: [authGuard, roleGuard('admin','empresa')] },
  { path: 'acciones/editar/:id', component: AccionesFormularioComponent,  canActivate: [authGuard, roleGuard('admin','empresa')] },

  { path: 'chat/:accionId',          component: ChatComponent,        canActivate: [authGuard, roleGuard('admin','empresa','cliente')] },
  { path: 'chat/cliente/:clienteId', component: ChatClienteComponent, canActivate: [authGuard, roleGuard('admin','empresa')] },

  { path: '**', redirectTo: '/' }
];
