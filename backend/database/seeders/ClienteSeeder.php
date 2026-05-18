<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use Carbon\Carbon;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        // Clientes para empresa_id 1 (Marketing Digital Pro)
        Cliente::create([
            'empresa_id' => 1,
            'nombre' => 'Ana García Pérez',
            'email' => 'ana.garcia@ejemplo.com',
            'telefono' => '+34 600 111 222',
            'empresa_cliente' => 'TechStart SL',
            'estado' => 'cliente',
            'notas' => 'Cliente premium desde 2024. Interesado en campañas SEO.',
            'fecha_contacto' => Carbon::now()->subMonths(3)
        ]);

        Cliente::create([
            'empresa_id' => 1,
            'nombre' => 'Carlos Rodríguez López',
            'email' => 'carlos.rodriguez@ejemplo.es',
            'telefono' => '+34 611 222 333',
            'empresa_cliente' => 'Comercio Online SA',
            'estado' => 'negociacion',
            'notas' => 'En proceso de negociación de paquete anual.',
            'fecha_contacto' => Carbon::now()->subDays(15)
        ]);

        Cliente::create([
            'empresa_id' => 1,
            'nombre' => 'María Fernández Ruiz',
            'email' => 'maria.fernandez@ejemplo.com',
            'telefono' => '+34 622 333 444',
            'empresa_cliente' => 'Diseño y Estilo',
            'estado' => 'lead',
            'notas' => 'Contacto inicial por LinkedIn. Interés en redes sociales.',
            'fecha_contacto' => Carbon::now()->subDays(5)
        ]);

        // Clientes para empresa_id 2 (Solutions Agency)
        Cliente::create([
            'empresa_id' => 2,
            'nombre' => 'Juan Martínez Sánchez',
            'email' => 'juan.martinez@ejemplo.es',
            'telefono' => '+34 633 444 555',
            'empresa_cliente' => 'Restaurante El Buen Sabor',
            'estado' => 'cliente',
            'notas' => 'Campaña local de Google Ads activa.',
            'fecha_contacto' => Carbon::now()->subMonths(6)
        ]);

        Cliente::create([
            'empresa_id' => 2,
            'nombre' => 'Laura González Díaz',
            'email' => 'laura.gonzalez@ejemplo.com',
            'telefono' => '+34 644 555 666',
            'empresa_cliente' => 'Clínica Dental Sonrisas',
            'estado' => 'contactado',
            'notas' => 'Primera llamada realizada. Enviar propuesta.',
            'fecha_contacto' => Carbon::now()->subDays(8)
        ]);

        Cliente::create([
            'empresa_id' => 2,
            'nombre' => 'Pedro Jiménez Torres',
            'email' => 'pedro.jimenez@ejemplo.es',
            'telefono' => '+34 655 666 777',
            'empresa_cliente' => 'Asesoría Fiscal López',
            'estado' => 'lead',
            'notas' => 'Formulario web completado.',
            'fecha_contacto' => Carbon::now()->subDays(2)
        ]);

        // Clientes para empresa_id 3 (StartUp Media)
        Cliente::create([
            'empresa_id' => 3,
            'nombre' => 'Sofía Morales Vega',
            'email' => 'sofia.morales@ejemplo.com',
            'telefono' => '+34 666 777 888',
            'empresa_cliente' => 'Gimnasio FitLife',
            'estado' => 'cliente',
            'notas' => 'Cliente recurrente. Campañas mensuales de Instagram.',
            'fecha_contacto' => Carbon::now()->subMonths(4)
        ]);

        Cliente::create([
            'empresa_id' => 3,
            'nombre' => 'Diego Herrera Castro',
            'email' => 'diego.herrera@ejemplo.es',
            'telefono' => '+34 677 888 999',
            'empresa_cliente' => 'Librería Cultural',
            'estado' => 'inactivo',
            'notas' => 'Sin actividad desde diciembre 2025.',
            'fecha_contacto' => Carbon::now()->subMonths(8)
        ]);

        // Clientes para empresa_id 4 (Creativos Unidos)
        Cliente::create([
            'empresa_id' => 4,
            'nombre' => 'Elena Romero Blanco',
            'email' => 'elena.romero@ejemplo.com',
            'telefono' => '+34 688 999 000',
            'empresa_cliente' => 'Boutique Moda Única',
            'estado' => 'negociacion',
            'notas' => 'Propuesta de branding enviada. Pendiente respuesta.',
            'fecha_contacto' => Carbon::now()->subDays(10)
        ]);

        Cliente::create([
            'empresa_id' => 4,
            'nombre' => 'Roberto Castillo Ruiz',
            'email' => 'roberto.castillo@ejemplo.es',
            'telefono' => '+34 699 000 111',
            'empresa_cliente' => 'Ferretería Industrial',
            'estado' => 'lead',
            'notas' => 'Contacto desde feria. Seguimiento pendiente.',
            'fecha_contacto' => Carbon::now()->subDays(12)
        ]);

        // Clientes para empresa_id 5 (Growth Marketing SL)
        Cliente::create([
            'empresa_id' => 5,
            'nombre' => 'Isabel Navarro Gil',
            'email' => 'isabel.navarro@ejemplo.com',
            'telefono' => '+34 600 222 333',
            'empresa_cliente' => 'Agencia de Viajes Mundo Tour',
            'estado' => 'cliente',
            'notas' => 'Estrategia de contenido y email marketing activos.',
            'fecha_contacto' => Carbon::now()->subMonths(5)
        ]);

        Cliente::create([
            'empresa_id' => 5,
            'nombre' => 'Francisco Ortega Medina',
            'email' => 'francisco.ortega@ejemplo.es',
            'telefono' => '+34 611 333 444',
            'empresa_cliente' => 'Taller Mecánico AutoExpert',
            'estado' => 'contactado',
            'notas' => 'Reunión programada para próxima semana.',
            'fecha_contacto' => Carbon::now()->subDays(4)
        ]);
    }
}
