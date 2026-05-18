import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-clientes-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class ClientesFormularioComponent implements OnInit {

  cliente: any = {
    nombre: '',
    email: '',
    telefono: '',
    empresa_cliente: '',
    empresa_id: null,
    estado: 'lead',
    notas: '',
    fecha_contacto: ''
  };

  empresas: any[] = [];
  esEdicion = false;
  clienteId: number = 0;
  guardando = false;
  error = '';

  constructor(
    private clienteService: ClienteService,
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Cargar las empresas para el selector
    this.empresaService.getEmpresas().subscribe({
      next: (data: any) => {
        this.empresas = data;
      },
      error: (err: any) => console.error('Error cargando empresas:', err)
    });

    // Ver si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.clienteId = parseInt(id);
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: number) {
    this.clienteService.getCliente(id).subscribe({
      next: (data: any) => {
        this.cliente = data;
      },
      error: (err: any) => {
        this.error = 'No se pudo cargar el cliente';
        console.error(err);
      }
    });
  }

  guardar() {
    this.guardando = true;
    this.error = '';

    if (this.esEdicion) {
      this.clienteService.actualizarCliente(this.clienteId, this.cliente).subscribe({
        next: () => {
          this.router.navigate(['/clientes']);
        },
        error: (err: any) => {
          this.error = 'Error al actualizar el cliente';
          this.guardando = false;
          console.error(err);
        }
      });
    } else {
      this.clienteService.crearCliente(this.cliente).subscribe({
        next: () => {
          this.router.navigate(['/clientes']);
        },
        error: (err: any) => {
          this.error = 'Error al crear el cliente';
          this.guardando = false;
          console.error(err);
        }
      });
    }
  }
}
