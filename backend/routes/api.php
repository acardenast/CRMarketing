<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AccionController;
use App\Http\Controllers\Api\MensajeController;

// ── Rutas públicas ────────────────────────────────────────────────────────────
Route::post('/auth/login',            [AuthController::class, 'login']);
Route::post('/auth/register/empresa', [AuthController::class, 'registerEmpresa']);
Route::post('/auth/register/cliente', [AuthController::class, 'registerCliente']);

Route::get('/public/empresas', function () {
    return \App\Models\Empresa::where('activa', true)
        ->select('id', 'nombre')->orderBy('nombre')->get();
});

// ── Rutas protegidas ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me',   [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $r) => $r->user());

    // Dashboard — todos los roles
    Route::get('/dashboard/stats',            [DashboardController::class, 'stats']);
    Route::get('/dashboard/ultimas-acciones', [DashboardController::class, 'ultimasAcciones']);
    Route::get('/dashboard/clientes-estado',  [DashboardController::class, 'clientesPorEstado']);
    Route::get('/dashboard/proximas-acciones',[DashboardController::class, 'proximasAcciones']);
    Route::get('/dashboard/ingresos-admin',   [DashboardController::class, 'ingresosAdmin']);
    Route::get('/dashboard/ingresos-empresa', [DashboardController::class, 'ingresosEmpresa']);

    // Acciones — todos los roles (el controller filtra por rol internamente)
    Route::get('acciones',              [AccionController::class, 'index']);
    Route::get('acciones/{id}',         [AccionController::class, 'show']);
    Route::patch('acciones/{id}/pago',  [AccionController::class, 'actualizarPago']);
    Route::get('acciones/{accionId}/mensajes',  [MensajeController::class, 'index']);
     Route::post('acciones/{accionId}/mensajes', [MensajeController::class, 'store']);

    // Acciones escritura — solo admin y empresa
    Route::middleware('role:admin,empresa')->group(function () {
        Route::post('acciones',              [AccionController::class, 'store']);
        Route::put('acciones/{id}',          [AccionController::class, 'update']);
        Route::delete('acciones/{id}',       [AccionController::class, 'destroy']);

        Route::apiResource('empresas', EmpresaController::class);
        Route::apiResource('clientes', ClienteController::class);
    });

    // Cliente
    Route::middleware('role:cliente')->group(function () {
        Route::get('/mi-perfil', fn(Request $r) => $r->user()->load(['empresa','cliente']));
    });
});
