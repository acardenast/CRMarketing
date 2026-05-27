<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('archivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accion_id')->constrained('acciones')->cascadeOnDelete();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->string('nombre_original');
            $table->string('nombre_disco');      // nombre uuid en storage
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('tamano'); // bytes
            $table->string('ruta');               // ruta relativa en storage/app/public
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archivos');
    }
};
