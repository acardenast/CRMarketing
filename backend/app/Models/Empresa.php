<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'plan',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function clientes()
    {
        return $this->hasMany(Cliente::class);
    }

    public function usuarios()
    {
        return $this->hasMany(User::class);
    }

    public function usuarioPrincipal()
    {
        return $this->hasOne(User::class);
    }
}