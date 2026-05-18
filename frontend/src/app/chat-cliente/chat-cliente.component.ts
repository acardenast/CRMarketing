import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AccionService } from '../services/accion.service';

@Component({
  selector: 'app-chat-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-cliente.component.html',
  styleUrls: ['./chat-cliente.component.css']
})
export class ChatClienteComponent implements OnInit {
  clienteId!: number;
  acciones: any[] = [];
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private accionService: AccionService
  ) {}

  ngOnInit() {
    this.clienteId = Number(this.route.snapshot.paramMap.get('clienteId'));
    this.accionService.getAccionesPorCliente(this.clienteId).subscribe({
      next: (data: any) => { this.acciones = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar las acciones'; this.cargando = false; }
    });
  }

  getIconoTipo(tipo: string): string {
    const map: any = { llamada:'📞', email:'📧', reunion:'🤝', campana:'📣', nota:'📝', chat:'💬', seguimiento:'🔔' };
    return map[tipo] || '⚡';
  }
}