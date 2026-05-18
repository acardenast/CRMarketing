<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $fillable = [
        'empresa_id',
        'nombre',
        'email',
        'telefono',
        'empresa_cliente',
        'estado',
        'notas',
        'fecha_contacto'
    ];

    protected $casts = [
        'fecha_contacto' => 'date',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function acciones()
    {
        return $this->hasMany(Accion::class);
    }

    public function usuario()
    {
        return $this->hasOne(User::class);
    }
}