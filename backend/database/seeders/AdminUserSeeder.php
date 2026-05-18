<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrador',
                'email' => 'admin@crm.local',
                'password' => Hash::make('admin1234'),
                'rol' => 'admin',
                'activo' => true,
                'empresa_id' => null,
                'cliente_id' => null,
            ]
        );
    }
}