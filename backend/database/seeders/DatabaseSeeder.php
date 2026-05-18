<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            EmpresaSeeder::class,
            ClienteSeeder::class,
            AccionSeeder::class,
            AdminUserSeeder::class,
            UsuarioSeeder::class,
        ]);
    }
}
