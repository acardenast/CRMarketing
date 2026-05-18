<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accion extends Model
{
    protected $table = 'acciones';

    protected $fillable = [
        'empresa_id', 'cliente_id', 'usuario_id',
        'tipo', 'titulo', 'descripcion', 'estado',
        'fecha_inicio', 'fecha_fin', 'todo_el_dia', 'metadata',
        'precio', 'comision', 'ingreso_neto', 'estado_pago'
    ];

    protected $casts = [
        'fecha_inicio'  => 'datetime',
        'fecha_fin'     => 'datetime',
        'todo_el_dia'   => 'boolean',
        'metadata'      => 'array',
        'precio'        => 'decimal:2',
        'comision'      => 'decimal:2',
        'ingreso_neto'  => 'decimal:2',
    ];

    public function empresa()  { return $this->belongsTo(Empresa::class); }
    public function cliente()  { return $this->belongsTo(Cliente::class); }
    public function usuario()  { return $this->belongsTo(User::class); }
    public function mensajes() { return $this->hasMany(Mensaje::class); }
}
