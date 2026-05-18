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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');
            $table->string('nombre');
            $table->string('email')->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('empresa_cliente')->nullable(); // Empresa del cliente
            $table->enum('estado', ['lead', 'contactado', 'negociacion', 'cliente', 'inactivo'])->default('lead');
            $table->text('notas')->nullable();
            $table->date('fecha_contacto')->nullable();
            $table->timestamps();
            
            $table->index('empresa_id');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
