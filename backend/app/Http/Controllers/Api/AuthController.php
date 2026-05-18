<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
            'rol' => 'required|in:admin,empresa,cliente',
        ]);

        $user = User::where('username', $validated['login'])
            ->orWhere('email', $validated['login'])
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Credenciales incorrectas.'],
            ]);
        }

        if ($user->rol !== $validated['rol']) {
            throw ValidationException::withMessages([
                'login' => ['Este acceso no corresponde al perfil seleccionado.'],
            ]);
        }

        if (!$user->activo) {
            throw ValidationException::withMessages([
                'login' => ['Tu cuenta está desactivada.'],
            ]);
        }

        $user->tokens()->delete();
        $user->ultimo_acceso = now();
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load(['empresa', 'cliente']),
        ]);
    }

    public function registerEmpresa(Request $request)
    {
        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'email_empresa' => 'required|email|unique:empresas,email',
            'telefono_empresa' => 'nullable|string|max:20',
            'plan' => 'required|in:basico,premium',
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $empresa = Empresa::create([
            'nombre' => $validated['nombre_empresa'],
            'email' => $validated['email_empresa'],
            'telefono' => $validated['telefono_empresa'] ?? null,
            'plan' => $validated['plan'],
            'activa' => true,
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'] ?? null,
            'password' => $validated['password'],
            'rol' => 'empresa',
            'empresa_id' => $empresa->id,
            'cliente_id' => null,
            'activo' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Empresa registrada correctamente',
            'token' => $token,
            'user' => $user->load('empresa'),
        ], 201);
    }

    public function registerCliente(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email|unique:clientes,email',
            'telefono' => 'nullable|string|max:20',
            'empresa_cliente' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $cliente = Cliente::create([
            'empresa_id' => $validated['empresa_id'],
            'nombre' => $validated['name'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'] ?? null,
            'empresa_cliente' => $validated['empresa_cliente'] ?? null,
            'estado' => 'lead',
            'notas' => $validated['notas'] ?? null,
            'fecha_contacto' => now()->toDateString(),
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'] ?? null,
            'password' => $validated['password'],
            'rol' => 'cliente',
            'empresa_id' => $validated['empresa_id'],
            'cliente_id' => $cliente->id,
            'activo' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Cliente registrado correctamente',
            'token' => $token,
            'user' => $user->load(['empresa', 'cliente']),
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load(['empresa', 'cliente'])
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Sesión cerrada',
        ]);
    }
}