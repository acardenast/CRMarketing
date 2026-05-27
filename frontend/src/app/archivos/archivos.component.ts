import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArchivoService, Archivo } from '../services/archivo.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-archivos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {
  accionId!: number;
  archivos: Archivo[] = [];
  cargando = true;
  subiendo = false;
  error = '';
  exito = '';

  constructor(
    private route: ActivatedRoute,
    private archivoService: ArchivoService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.accionId = Number(this.route.snapshot.paramMap.get('accionId'));
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.archivoService.getArchivosPorAccion(this.accionId).subscribe({
      next: (data) => { this.archivos = data; this.cargando = false; },
      error: () => { this.error = 'No se pudieron cargar los archivos'; this.cargando = false; }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.subirArchivo(file);
    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.subirArchivo(file);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  subirArchivo(file: File) {
    this.subiendo = true;
    this.exito = '';
    this.error = '';
    this.archivoService.subirArchivo(this.accionId, file).subscribe({
      next: (a) => {
        this.archivos.unshift(a);
        this.exito = `"${a.nombre_original}" subido correctamente`;
        this.subiendo = false;
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al subir el archivo'; this.subiendo = false; }
    });
  }

  eliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    this.archivoService.eliminarArchivo(id).subscribe({
      next: () => this.archivos = this.archivos.filter(a => a.id !== id),
      error: () => alert('Error al eliminar')
    });
  }

  icono(mime: string) { return this.archivoService.icono(mime); }
  esImagen(mime: string) { return this.archivoService.esImagen(mime); }
  formatBytes(b: number) { return this.archivoService.formatBytes(b); }
}
