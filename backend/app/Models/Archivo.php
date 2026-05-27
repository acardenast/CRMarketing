<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Archivo extends Model
{
    protected $fillable = [
        'accion_id',
        'cliente_id',
        'usuario_id',
        'nombre_original',
        'nombre_disco',
        'mime_type',
        'tamano',
        'ruta',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::url($this->ruta);
    }

    public function accion()  { return $this->belongsTo(Accion::class); }
    public function cliente() { return $this->belongsTo(Cliente::class); }
    public function usuario() { return $this->belongsTo(User::class, 'usuario_id'); }
}
