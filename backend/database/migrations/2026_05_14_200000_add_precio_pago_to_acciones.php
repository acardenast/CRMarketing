<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('acciones', function (Blueprint $table) {
            $table->decimal('precio', 10, 2)->nullable()->after('metadata');
            $table->decimal('comision', 10, 2)->nullable()->after('precio');
            $table->decimal('ingreso_neto', 10, 2)->nullable()->after('comision');
            $table->enum('estado_pago', ['pendiente','en_proceso','pagado'])->default('pendiente')->after('ingreso_neto');
        });
    }

    public function down(): void
    {
        Schema::table('acciones', function (Blueprint $table) {
            $table->dropColumn(['precio', 'comision', 'ingreso_neto', 'estado_pago']);
        });
    }
};
