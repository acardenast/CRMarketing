<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Archivo;
use App\Models\Accion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArchivoController extends Controller
{
    /**
     * GET /api/acciones/{accionId}/archivos
     * Lista archivos de una acción.
     */
    public function index($accionId)
    {
        $user   = Auth::user();
        $accion = Accion::findOrFail($accionId);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);
        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $archivos = Archivo::with(['usuario', 'cliente'])
            ->where('accion_id', $accionId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($archivos);
    }

    /**
     * GET /api/clientes/{clienteId}/archivos?accion_id=X
     * Lista todos los archivos de un cliente, con filtro opcional por acción.
     */
    public function byCliente(Request $request, $clienteId)
    {
        $user = Auth::user();

        if ($user->rol === 'cliente' && $user->cliente_id != $clienteId)
            return response()->json(['message' => 'No autorizado'], 403);

        $query = Archivo::with(['accion', 'usuario'])
            ->where('cliente_id', $clienteId);

        if ($user->rol === 'empresa') {
            $query->whereHas('accion', fn($q) => $q->where('empresa_id', $user->empresa_id));
        }

        if ($request->filled('accion_id')) {
            $query->where('accion_id', $request->accion_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * POST /api/acciones/{accionId}/archivos
     * Sube un archivo.
     */
    public function store(Request $request, $accionId)
    {
        $user   = Auth::user();
        $accion = Accion::findOrFail($accionId);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);
        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $request->validate([
            'archivo' => 'required|file|max:20480', // 20 MB max
        ]);

        $file          = $request->file('archivo');
        $nombreOriginal = $file->getClientOriginalName();
        $mime           = $file->getMimeType();
        $tamano         = $file->getSize();
        $nombreDisco    = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $ruta           = $file->storeAs('archivos', $nombreDisco, 'public');

        $archivo = Archivo::create([
            'accion_id'      => $accionId,
            'cliente_id'     => $accion->cliente_id,
            'usuario_id'     => $user->rol !== 'cliente' ? $user->id : null,
            'nombre_original'=> $nombreOriginal,
            'nombre_disco'   => $nombreDisco,
            'mime_type'      => $mime,
            'tamano'         => $tamano,
            'ruta'           => $ruta,
        ]);

        $archivo->load(['usuario', 'cliente']);

        return response()->json($archivo, 201);
    }

    /**
     * DELETE /api/archivos/{id}
     */
    public function destroy($id)
    {
        $user    = Auth::user();
        $archivo = Archivo::findOrFail($id);

        // Solo admin o empresa propietaria pueden eliminar
        if ($user->rol === 'cliente')
            return response()->json(['message' => 'No autorizado'], 403);

        if ($user->rol === 'empresa') {
            $accion = Accion::findOrFail($archivo->accion_id);
            if ($accion->empresa_id != $user->empresa_id)
                return response()->json(['message' => 'No autorizado'], 403);
        }

        Storage::disk('public')->delete($archivo->ruta);
        $archivo->delete();

        return response()->json(['message' => 'Eliminado']);
    }
}
