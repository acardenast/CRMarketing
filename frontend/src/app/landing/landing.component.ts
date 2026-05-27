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
      titulo: 'Gestión de Clientes',
      descripcion: 'Centraliza todos tus clientes en un solo lugar. Consulta su estado, historial de acciones y comunicación en tiempo real desde su perfil.'
    },
    {
      icon: 'bolt',
      titulo: 'Acciones y Campañas',
      descripcion: 'Registra llamadas, reuniones, propuestas y campañas de marketing. Cada acción queda vinculada a su cliente con fecha, estado y seguimiento de pago.'
    },
    {
      icon: 'chat',
      titulo: 'Chat Integrado',
      descripcion: 'Comunica con tus clientes directamente desde la plataforma. Envía mensajes, comparte imágenes, documentos y archivos en cada conversación.'
    },
    {
      icon: 'payments',
      titulo: 'Control de Cobros',
      descripcion: 'Gestiona el estado de pago de cada acción: pendiente, parcial o pagado. Visualiza en el dashboard los ingresos netos y pendientes de cobro en tiempo real.'
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
      icon: 'business',
      nombre: 'Empresa',
      descripcion: 'Gestiona tus propios clientes, crea acciones, lanza campañas y comunica con ellos a través del chat. Control total de tu cartera y cobros.',
      color: 'bg-teal-soft border-teal-200',
      iconColor: 'text-teal'
    },
    {
      icon: 'person',
      nombre: 'Cliente',
      descripcion: 'Portal propio para ver las acciones contratadas, hacer seguimiento del estado de sus servicios y comunicarte directamente con tu agencia.',
      color: 'bg-blue-soft border-blue-200',
      iconColor: 'text-blue'
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
