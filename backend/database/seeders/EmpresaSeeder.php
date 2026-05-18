<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        Empresa::create([
            'nombre' => 'Marketing Digital Pro',
            'email' => 'contacto@marketingpro.com',
            'telefono' => '+34 911 234 567',
            'plan' => 'premium'
        ]);

        Empresa::create([
            'nombre' => 'Solutions Agency',
            'email' => 'info@solutionsagency.es',
            'telefono' => '+34 622 345 678',
            'plan' => 'premium'
        ]);

        Empresa::create([
            'nombre' => 'StartUp Media',
            'email' => 'hola@startupmedia.com',
            'telefono' => '+34 655 789 012',
            'plan' => 'basico'
        ]);

        Empresa::create([
            'nombre' => 'Creativos Unidos',
            'email' => 'ventas@creativosunidos.es',
            'telefono' => '+34 677 890 123',
            'plan' => 'basico'
        ]);

        Empresa::create([
            'nombre' => 'Growth Marketing SL',
            'email' => 'admin@growthmarketing.es',
            'telefono' => '+34 688 901 234',
            'plan' => 'premium'
        ]);

        Empresa::create([
            'nombre' => 'Consultores Digitales',
            'email' => 'contacto@consultoresdigitales.com',
            'telefono' => '+34 699 012 345',
            'plan' => 'basico'
        ]);
    }
}
