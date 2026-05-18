<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Cliente::with('empresa');

        if ($user->rol === 'admin') {
            if ($request->has('empresa_id')) $query->where('empresa_id', $request->empresa_id);
        } elseif ($user->rol === 'empresa') {
            $query->where('empresa_id', $user->empresa_id);
        } elseif ($user->rol === 'cliente') {
            $query->where('id', $user->cliente_id);
        } else {
            return response()->json([], 403);
        }

        if ($request->has('estado')) $query->where('estado', $request->estado);

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'empresa_id'      => 'required|exists:empresas,id',
            'nombre'          => 'required|string|max:255',
            'email'           => 'required|email|unique:clientes',
            'telefono'        => 'nullable|string|max:20',
            'empresa_cliente' => 'nullable|string|max:255',
            'estado'          => 'required|in:lead,contactado,negociacion,cliente,inactivo',
            'notas'           => 'nullable|string',
            'fecha_contacto'  => 'nullable|date'
        ]);

        if ($user->rol === 'empresa' && $validated['empresa_id'] != $user->empresa_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $cliente = Cliente::create($validated);
        return response()->json(['message' => 'Cliente creado exitosamente', 'data' => $cliente], 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $cliente = Cliente::with(['empresa', 'acciones'])->findOrFail($id);

        if ($user->rol === 'empresa' && $cliente->empresa_id != $user->empresa_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        if ($user->rol === 'cliente' && $cliente->id != $user->cliente_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($cliente);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $cliente = Cliente::findOrFail($id);

        if ($user->rol === 'empresa' && $cliente->empresa_id != $user->empresa_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'nombre'          => 'sometimes|string|max:255',
            'email'           => 'sometimes|email|unique:clientes,email,' . $id,
            'telefono'        => 'nullable|string|max:20',
            'empresa_cliente' => 'nullable|string|max:255',
            'estado'          => 'sometimes|in:lead,contactado,negociacion,cliente,inactivo',
            'notas'           => 'nullable|string',
            'fecha_contacto'  => 'nullable|date'
        ]);

        $cliente->update($validated);
        return response()->json(['message' => 'Cliente actualizado', 'data' => $cliente]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $cliente = Cliente::findOrFail($id);

        if ($user->rol === 'empresa' && $cliente->empresa_id != $user->empresa_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $cliente->delete();
        return response()->json(['message' => 'Cliente eliminado']);
    }
}
