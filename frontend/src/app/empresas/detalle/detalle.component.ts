import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-empresas-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class EmpresasDetalleComponent implements OnInit {

  empresa: any = null;
  clientes: any[] = [];
  cargando = true;
  error = '';

  constructor(
    private empresaService: EmpresaService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEmpresa(parseInt(id));
    }
  }

  cargarEmpresa(id: number) {
    this.empresaService.getEmpresa(id).subscribe({
      next: (data: any) => {
        this.empresa = data;
        // Cargar los clientes de esta empresa
        this.clienteService.getClientes().subscribe({
          next: (clientes: any) => {
            // Filtrar solo los clientes de esta empresa
            this.clientes = clientes.filter((c: any) => c.empresa_id === id);
            this.cargando = false;
          },
          error: () => { this.cargando = false; }
        });
      },
      error: (err: any) => {
        this.error = 'No se pudo cargar la empresa';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  eliminar() {
    if (confirm('¿Seguro que quieres eliminar esta empresa?')) {
      this.empresaService.eliminarEmpresa(this.empresa.id).subscribe({
        next: () => {
          this.router.navigate(['/empresas']);
        },
        error: (err: any) => {
          alert('Error al eliminar');
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
    return 'bg-gray-100 text-gray-700';
  }
}
