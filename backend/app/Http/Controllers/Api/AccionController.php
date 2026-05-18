<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accion;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Accion::with('cliente');

        if ($user->rol === 'admin') {
            if ($request->has('empresa_id')) $query->where('empresa_id', $request->empresa_id);
            if ($request->has('cliente_id')) $query->where('cliente_id', $request->cliente_id);
        } elseif ($user->rol === 'empresa') {
            $query->where('empresa_id', $user->empresa_id);
            if ($request->has('cliente_id')) $query->where('cliente_id', $request->cliente_id);
        } elseif ($user->rol === 'cliente') {
            $query->where('cliente_id', $user->cliente_id);
        } else {
            return response()->json([], 403);
        }

        if ($request->has('tipo')) $query->where('tipo', $request->tipo);

        return response()->json($query->orderBy('fecha_inicio', 'desc')->get());
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'empresa_id'   => 'required|exists:empresas,id',
            'cliente_id'   => 'required|exists:clientes,id',
            'usuario_id'   => 'nullable|exists:users,id',
            'tipo'         => 'required|in:chat,email,llamada,reunion,campana,nota',
            'titulo'       => 'nullable|string|max:255',
            'descripcion'  => 'nullable|string',
            'estado'       => 'required|in:pendiente,en_progreso,completada,cancelada',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'    => 'nullable|date|after:fecha_inicio',
            'todo_el_dia'  => 'nullable|boolean',
            'metadata'     => 'nullable',
            'precio'       => 'nullable|numeric|min:0',
            'estado_pago'  => 'nullable|in:pendiente,en_proceso,pagado',
        ]);

        if ($user->rol === 'empresa' && $validated['empresa_id'] != $user->empresa_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Calcular comisión si es campaña con precio
        if (($validated['tipo'] ?? '') === 'campana' && !empty($validated['precio'])) {
            $empresa = Empresa::find($validated['empresa_id']);
            $porcentaje = ($empresa && $empresa->plan === 'premium') ? 0.05 : 0.10;
            $validated['comision']     = round($validated['precio'] * $porcentaje, 2);
            $validated['ingreso_neto'] = round($validated['precio'] - $validated['comision'], 2);
        }

        $validated['estado_pago'] = $validated['estado_pago'] ?? 'pendiente';
        $accion = Accion::create($validated);

        return response()->json(['message' => 'Acción creada exitosamente', 'data' => $accion], 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $accion = Accion::with('cliente')->findOrFail($id);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);
        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        return response()->json($accion);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $accion = Accion::findOrFail($id);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $validated = $request->validate([
            'empresa_id'   => 'required|exists:empresas,id',
            'cliente_id'   => 'required|exists:clientes,id',
            'usuario_id'   => 'nullable|exists:users,id',
            'tipo'         => 'required|in:chat,email,llamada,reunion,campana,nota',
            'titulo'       => 'nullable|string|max:255',
            'descripcion'  => 'nullable|string',
            'estado'       => 'required|in:pendiente,en_progreso,completada,cancelada',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'    => 'nullable|date|after:fecha_inicio',
            'todo_el_dia'  => 'nullable|boolean',
            'metadata'     => 'nullable',
            'precio'       => 'nullable|numeric|min:0',
            'estado_pago'  => 'nullable|in:pendiente,en_proceso,pagado',
        ]);

        // Recalcular comisión si cambia precio o tipo
        if (($validated['tipo'] ?? '') === 'campana' && !empty($validated['precio'])) {
            $empresa = Empresa::find($validated['empresa_id']);
            $porcentaje = ($empresa && $empresa->plan === 'premium') ? 0.05 : 0.10;
            $validated['comision']     = round($validated['precio'] * $porcentaje, 2);
            $validated['ingreso_neto'] = round($validated['precio'] - $validated['comision'], 2);
        }

        $accion->update($validated);
        return response()->json(['message' => 'Acción actualizada correctamente', 'data' => $accion]);
    }

    // PATCH solo para cambiar estado_pago (usado por el botón pagar del cliente)
    public function actualizarPago(Request $request, $id)
    {
        $user = Auth::user();
        $accion = Accion::findOrFail($id);

        if ($user->rol === 'cliente' && $accion->cliente_id != $user->cliente_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $request->validate(['estado_pago' => 'required|in:pendiente,en_proceso,pagado']);
        $accion->update(['estado_pago' => $request->estado_pago]);

        return response()->json(['message' => 'Estado de pago actualizado', 'data' => $accion]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $accion = Accion::findOrFail($id);

        if ($user->rol === 'empresa' && $accion->empresa_id != $user->empresa_id)
            return response()->json(['message' => 'No autorizado'], 403);

        $accion->delete();
        return response()->json(['message' => 'Acción eliminada correctamente']);
    }
}
