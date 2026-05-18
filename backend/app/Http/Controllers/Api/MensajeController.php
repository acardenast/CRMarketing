<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mensajes;
use App\Models\Accion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MensajeController extends Controller
{
    // GET /api/acciones/{accionId}/mensajes
    public function index($accionId)
    {
        $user   = Auth::user();
        $accion = Accion::findOrFail($accionId);

        // Cada rol solo puede ver mensajes de acciones que le pertenecen
        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);

        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $mensajes = Mensajes::with(['usuario', 'cliente'])
            ->where('accion_id', $accionId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Marcar como leídos los mensajes que no son del usuario actual
        Mensajes::where('accion_id', $accionId)
            ->where('leido', false)
            ->when($user->rol === 'cliente', fn($q) => $q->whereNotNull('usuario_id'))
            ->when($user->rol !== 'cliente', fn($q) => $q->whereNull('usuario_id'))
            ->update(['leido' => true, 'fecha_lectura' => now()]);

        return response()->json($mensajes);
    }

    // POST /api/acciones/{accionId}/mensajes
    public function store(Request $request, $accionId)
    {
        $user   = Auth::user();
        $accion = Accion::findOrFail($accionId);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);

        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $request->validate([
            'mensaje' => 'required|string|max:2000',
        ]);

        $mensaje = Mensajes::create([
            'accion_id'  => $accionId,
            'usuario_id' => $user->rol !== 'cliente' ? $user->id : null,
            'cliente_id' => $accion->cliente_id,
            'mensaje'    => $request->mensaje,
            'tipo'       => 'texto',
            'leido'      => false,
        ]);

        $mensaje->load(['usuario', 'cliente']);

        return response()->json($mensaje, 201);
    }
}