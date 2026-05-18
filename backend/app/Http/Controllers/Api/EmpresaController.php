<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    // GET /api/empresas
    public function index()
    {
        $empresas = Empresa::all();
        return response()->json($empresas);
    }

    // POST /api/empresas
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:empresas',
            'telefono' => 'nullable|string|max:20',
            'plan' => 'required|in:basico,premium'
        ]);

        $empresa = Empresa::create($validated);
        
        return response()->json([
            'message' => 'Empresa creada exitosamente',
            'data' => $empresa
        ], 201);
    }

    // GET /api/empresas/{id}
    public function show($id)
    {
        $empresa = Empresa::with('clientes')->findOrFail($id);
        return response()->json($empresa);
    }

    // PUT /api/empresas/{id}
    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);
        
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:empresas,email,'.$id,
            'telefono' => 'nullable|string|max:20',
            'plan' => 'sometimes|in:basico,premium',
            'activa' => 'sometimes|boolean'
        ]);

        $empresa->update($validated);
        
        return response()->json([
            'message' => 'Empresa actualizada',
            'data' => $empresa
        ]);
    }

    // DELETE /api/empresas/{id}
    public function destroy($id)
    {
        $empresa = Empresa::findOrFail($id);
        $empresa->delete();
        
        return response()->json([
            'message' => 'Empresa eliminada'
        ]);
    }
}
