import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: any[] = [];
  cargando = true;
  error = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clienteService.getClientes().subscribe({
      next: (data: any) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los clientes';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que quieres eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          this.cargarClientes();
        },
        error: (err: any) => {
          alert('Error al eliminar el cliente');
          console.error(err);
        }
      });
    }
  }

  getClaseEstado(estado: string): string {
    if (estado === 'lead')        return 'bg-yellow-100 text-yellow-800';
    if (estado === 'contactado')  return 'bg-blue-100 text-blue-800';
    if (estado === 'negociacion') return 'bg-purple-100 text-purple-800';
    if (estado === 'cliente')     return 'bg-green-100 text-green-800';
    if (estado === 'inactivo')    return 'bg-gray-100 text-gray-700';
    return 'bg-gray-100 text-gray-700';
  }
}
