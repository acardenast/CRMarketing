<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('acciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->enum('tipo', ['chat', 'email', 'llamada', 'reunion', 'campana', 'nota'])->default('nota');
            $table->string('titulo')->nullable();
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['pendiente', 'en_progreso', 'completada', 'cancelada'])->default('pendiente');
            
            // Campos para calendario/campañas
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_fin')->nullable();
            $table->boolean('todo_el_dia')->default(false);
            
            // Campos adicionales
            $table->json('metadata')->nullable(); // Datos extra (ej: duración llamada, enlaces)
            $table->timestamps();
            
            // Índices
            $table->index(['empresa_id', 'cliente_id']);
            $table->index('tipo');
            $table->index('fecha_inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accions');
    }
};
