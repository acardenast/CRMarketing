import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-empresas-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class EmpresasFormularioComponent implements OnInit {

  // Objeto con los datos del formulario
  empresa: any = {
    nombre: '',
    email: '',
    telefono: '',
    plan: 'basico'
  };

  esEdicion = false;
  empresaId: number = 0;
  guardando = false;
  error = '';

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Comprobar si hay un id en la URL (modo edición)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.empresaId = parseInt(id);
      this.cargarEmpresa(this.empresaId);
    }
  }

  cargarEmpresa(id: number) {
    this.empresaService.getEmpresa(id).subscribe({
      next: (data: any) => {
        this.empresa = data;
      },
      error: (err: any) => {
        this.error = 'No se pudo cargar la empresa';
        console.error(err);
      }
    });
  }

  guardar() {
    this.guardando = true;
    this.error = '';

    if (this.esEdicion) {
      // Actualizar empresa existente
      this.empresaService.actualizarEmpresa(this.empresaId, this.empresa).subscribe({
        next: () => {
          this.router.navigate(['/empresas']);
        },
        error: (err: any) => {
          this.error = 'Error al actualizar la empresa';
          this.guardando = false;
          console.error(err);
        }
      });
    } else {
      // Crear nueva empresa
      this.empresaService.crearEmpresa(this.empresa).subscribe({
        next: () => {
          this.router.navigate(['/empresas']);
        },
        error: (err: any) => {
          this.error = 'Error al crear la empresa';
          this.guardando = false;
          console.error(err);
        }
      });
    }
  }
}
