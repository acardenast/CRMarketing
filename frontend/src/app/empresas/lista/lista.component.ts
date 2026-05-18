import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-empresas-lista',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class EmpresasListaComponent implements OnInit {

  empresas: any[] = [];
  cargando = true;
  error = '';

  constructor(private empresaService: EmpresaService) {}

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.cargando = true;
    this.empresaService.getEmpresas().subscribe({
      next: (data: any) => {
        this.empresas = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar las empresas';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  eliminarEmpresa(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      this.empresaService.eliminarEmpresa(id).subscribe({
        next: () => {
          // Recargamos la lista después de eliminar
          this.cargarEmpresas();
        },
        error: (err: any) => {
          alert('Error al eliminar la empresa');
          console.error(err);
        }
      });
    }
  }
}
