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
        Schema::create('mensajes', function (Blueprint $table) {
             $table->id();
            $table->foreignId('accion_id')->constrained('acciones')->onDelete('cascade'); // Relacionado a acción tipo "chat"
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            
            $table->text('mensaje');
            $table->enum('tipo', ['texto', 'imagen', 'archivo'])->default('texto');
            $table->boolean('leido')->default(false);
            $table->timestamp('fecha_lectura')->nullable();
            
            $table->timestamps();
            
            $table->index('accion_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
