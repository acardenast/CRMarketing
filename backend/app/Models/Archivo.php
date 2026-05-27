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

    /**
     * Genera la URL pública desde R2.
     * Si R2_PUBLIC_URL está definido, lo usa como base.
     * Si no, usa temporaryUrl (URL firmada) como fallback.
     */
    public function getUrlAttribute(): string
    {
        $publicUrl = config('filesystems.disks.r2.url');

        if ($publicUrl) {
            return rtrim($publicUrl, '/') . '/' . $this->ruta;
        }

        // Fallback: URL firmada válida 60 minutos
        return Storage::disk('r2')->temporaryUrl($this->ruta, now()->addMinutes(60));
    }

    public function accion()  { return $this->belongsTo(Accion::class); }
    public function cliente() { return $this->belongsTo(Cliente::class); }
    public function usuario() { return $this->belongsTo(User::class, 'usuario_id'); }
}
