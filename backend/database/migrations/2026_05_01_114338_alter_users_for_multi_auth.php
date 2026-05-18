<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            DB::statement("ALTER TABLE users MODIFY empresa_id BIGINT UNSIGNED NULL");

            if (!Schema::hasColumn('users', 'cliente_id')) {
                $table->foreignId('cliente_id')->nullable()->after('empresa_id')->constrained('clientes')->nullOnDelete();
            }

            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->after('id');
            }

            if (Schema::hasColumn('users', 'nombre') && !Schema::hasColumn('users', 'name')) {
                $table->renameColumn('nombre', 'name');
            }
        });

        DB::statement("ALTER TABLE users MODIFY rol ENUM('admin','empresa','cliente') NOT NULL DEFAULT 'cliente'");
        DB::statement("UPDATE users SET rol = 'empresa' WHERE rol IN ('agente','viewer')");
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'cliente_id')) {
                $table->dropConstrainedForeignId('cliente_id');
            }

            if (Schema::hasColumn('users', 'username')) {
                $table->dropColumn('username');
            }

            if (Schema::hasColumn('users', 'name') && !Schema::hasColumn('users', 'nombre')) {
                $table->renameColumn('name', 'nombre');
            }
        });

        DB::statement("ALTER TABLE users MODIFY rol ENUM('admin','agente','viewer') NOT NULL DEFAULT 'agente'");
        DB::statement("ALTER TABLE users MODIFY empresa_id BIGINT UNSIGNED NOT NULL");
    }
};