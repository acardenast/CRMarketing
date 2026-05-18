<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Empresa;
use App\Models\Cliente;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        // Un usuario por cada empresa
        Empresa::all()->each(function ($empresa) {
            $slug = \Str::slug($empresa->nombre, '');
            User::updateOrCreate(
                ['email' => "empresa_{$empresa->id}@crm.local"],
                [
                    'name'        => 'Gestor ' . $empresa->nombre,
                    'username'   => 'empresa_' . $empresa->id,
                    'email'      => "empresa_{$empresa->id}@crm.local",
                    'password'   => Hash::make('empresa1234'),
                    'rol'        => 'empresa',
                    'empresa_id' => $empresa->id,
                    'cliente_id' => null,
                    'activo'     => true,
                ]
            );
        });

        // Un usuario por cada cliente
        Cliente::all()->each(function ($cliente) {
            User::updateOrCreate(
                ['email' => "cliente_{$cliente->id}@crm.local"],
                [
                    'name'        => $cliente->nombre,
                    'username'   => 'cliente_' . $cliente->id,
                    'email'      => "cliente_{$cliente->id}@crm.local",
                    'password'   => Hash::make('cliente1234'),
                    'rol'        => 'cliente',
                    'empresa_id' => $cliente->empresa_id,
                    'cliente_id' => $cliente->id,
                    'activo'     => true,
                ]
            );
        });
    }
}
