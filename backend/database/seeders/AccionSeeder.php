<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Accion;
use Carbon\Carbon;

class AccionSeeder extends Seeder
{
    public function run(): void
    {
        // Notas
        Accion::create([
            'empresa_id' => 1,
            'cliente_id' => 1,
            'tipo' => 'nota',
            'titulo' => 'Primera reunión',
            'descripcion' => 'Cliente muy interesado en SEO. Solicita propuesta.',
            'estado' => 'completada',
            'fecha_inicio' => Carbon::now()->subDays(10)
        ]);

        // Llamada
        Accion::create([
            'empresa_id' => 1,
            'cliente_id' => 2,
            'tipo' => 'llamada',
            'titulo' => 'Seguimiento propuesta',
            'descripcion' => 'Llamada de 30 minutos. Cliente pide descuento.',
            'estado' => 'completada',
            'fecha_inicio' => Carbon::now()->subDays(5),
            'metadata' => json_encode(['duracion' => 30])
        ]);

        // Reunión futura
        Accion::create([
            'empresa_id' => 1,
            'cliente_id' => 3,
            'tipo' => 'reunion',
            'titulo' => 'Demo producto',
            'descripcion' => 'Presentación de plataforma CRM',
            'estado' => 'pendiente',
            'fecha_inicio' => Carbon::now()->addDays(3),
            'fecha_fin' => Carbon::now()->addDays(3)->addHour()
        ]);

        // Campaña
        Accion::create([
            'empresa_id' => 2,
            'cliente_id' => 4,
            'tipo' => 'campana',
            'titulo' => 'Campaña Google Ads - Febrero',
            'descripcion' => 'Campaña local restaurante. Budget 500€',
            'estado' => 'en_progreso',
            'fecha_inicio' => Carbon::now()->subDays(7),
            'fecha_fin' => Carbon::now()->addDays(23)
        ]);

        // Email
        Accion::create([
            'empresa_id' => 2,
            'cliente_id' => 5,
            'tipo' => 'email',
            'titulo' => 'Envío propuesta comercial',
            'descripcion' => 'Propuesta plan anual con descuento 15%',
            'estado' => 'completada',
            'fecha_inicio' => Carbon::now()->subDays(2)
        ]);

        // Chat
        Accion::create([
            'empresa_id' => 3,
            'cliente_id' => 7,
            'tipo' => 'chat',
            'titulo' => 'Conversación WhatsApp',
            'descripcion' => 'Cliente pregunta por planes disponibles',
            'estado' => 'en_progreso',
            'fecha_inicio' => Carbon::now()->subHours(3)
        ]);
    }
}
