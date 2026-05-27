import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  mouseX = '50%';
  mouseY = '50%';
  scrolled = false;

  features = [
    {
      icon: 'groups',
      titulo: 'Gestión de Clientes y Empresas',
      descripcion: 'Centraliza todos tus clientes y empresas en un solo lugar. Consulta su estado, historial de acciones y comunicación en tiempo real desde su perfil.'
    },
    {
      icon: 'bolt',
      titulo: 'Acciones y Campañas',
      descripcion: 'Registra llamadas, reuniones, propuestas y campañas de marketing. Cada acción queda vinculada a su cliente con fecha, estado y seguimiento de pago.'
    },
    {
      icon: 'chat',
      titulo: 'Chat Integrado por Acción',
      descripcion: 'Comunica con tus clientes directamente desde la plataforma. Envía mensajes, comparte imágenes, documentos y archivos en cada conversación.'
    },
    {
      icon: 'analytics',
      titulo: 'Dashboard e Ingresos',
      descripcion: 'Visualiza en tiempo real el estado de tus ventas, ingresos por empresa, acciones pendientes y conversión de clientes con gráficas claras.'
    },
    {
      icon: 'calendar_month',
      titulo: 'Calendario de Acciones',
      descripcion: 'Vista de calendario mensual por cliente para planificar y revisar todas las acciones programadas sin perderse ninguna cita ni seguimiento.'
    },
    {
      icon: 'folder_open',
      titulo: 'Archivos Compartidos',
      descripcion: 'Accede a todos los archivos enviados en el chat filtrados por acción. Imágenes, PDFs, documentos: todo organizado y disponible cuando lo necesitas.'
    }
  ];

  roles = [
    {
      icon: 'admin_panel_settings',
      nombre: 'Administrador',
      descripcion: 'Visión global de todas las empresas, clientes e ingresos. Gestiona el acceso y supervisa el rendimiento de toda la plataforma.',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      icon: 'business',
      nombre: 'Empresa',
      descripcion: 'Gestiona tus propios clientes, crea acciones, lanza campañas y comunica con ellos a través del chat. Control total de tu cartera.',
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600'
    },
    {
      icon: 'person',
      nombre: 'Cliente',
      descripcion: 'Portal propio para ver las acciones contratadas, hacer seguimiento de pagos y comunicarte directamente con tu agencia.',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    }
  ];

  ngOnInit() {}
  ngOnDestroy() {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  onMouseMove(event: MouseEvent, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    this.mouseX = `${event.clientX - rect.left}px`;
    this.mouseY = `${event.clientY - rect.top}px`;
  }
}
