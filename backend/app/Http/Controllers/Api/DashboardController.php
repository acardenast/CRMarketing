<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Cliente;
use App\Models\Accion;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        if ($user->rol === 'admin') {
            $eid = $request->get('empresa_id');

            $clientesQ = Cliente::query();
            $accionesQ = Accion::query();
            if ($eid) {
                $clientesQ->where('empresa_id', $eid);
                $accionesQ->where('empresa_id', $eid);
            }

            $basico  = Empresa::where('plan','basico')->where('activa',true)->count();
            $premium = Empresa::where('plan','premium')->where('activa',true)->count();
            $mensualidades = ($basico * 100) + ($premium * 300);
            $comisiones = (clone $accionesQ)
                ->where('tipo','campana')->where('estado_pago','pagado')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->sum('comision');

            return response()->json([
                'total_empresas'     => Empresa::count(),
                'empresas_activas'   => Empresa::where('activa',true)->count(),
                'empresas_basico'    => $basico,
                'empresas_premium'   => $premium,
                'total_usuarios'     => User::count(),
                'total_clientes'     => $clientesQ->count(),
                'total_acciones'     => $accionesQ->count(),
                'acciones_hoy'       => (clone $accionesQ)->whereDate('created_at', today())->count(),
                'nuevos_esta_semana' => (clone $clientesQ)->where('created_at','>=',now()->startOfWeek())->count(),
                'mensualidades'      => $mensualidades,
                'comisiones_mes'     => round($comisiones, 2),
                'total_ingresos_mes' => round($mensualidades + $comisiones, 2),
            ]);
        }

        if ($user->rol === 'empresa') {
            $eid = $user->empresa_id;
            $empresa = Empresa::find($eid);
            $porcentaje = ($empresa && $empresa->plan === 'premium') ? 5 : 10;

            $ingresos = Accion::where('empresa_id', $eid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'pagado')
                ->sum('ingreso_neto');
            $comisiones = Accion::where('empresa_id', $eid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'pagado')
                ->sum('comision');
            $pendiente = Accion::where('empresa_id', $eid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'pendiente')
                ->sum('precio');

            return response()->json([
                'total_clientes'      => Cliente::where('empresa_id', $eid)->count(),
                'clientes_activos'    => Cliente::where('empresa_id', $eid)->where('estado', 'cliente')->count(),
                'total_acciones'      => Accion::where('empresa_id', $eid)->count(),
                'acciones_pendientes' => Accion::where('empresa_id', $eid)->where('estado', 'pendiente')->count(),
                'leads'               => Cliente::where('empresa_id', $eid)->where('estado', 'lead')->count(),
                'en_negociacion'      => Cliente::where('empresa_id', $eid)->where('estado', 'negociacion')->count(),
                'plan'                => $empresa->plan ?? 'basico',
                'porcentaje_crm'      => $porcentaje,
                'ingresos_netos'      => round($ingresos, 2),
                'comisiones_pagadas'  => round($comisiones, 2),
                'campanas_pendientes_cobro' => round($pendiente, 2),
            ]);
        }

        if ($user->rol === 'cliente') {
            $cid = $user->cliente_id;
            $gastado = Accion::where('cliente_id', $cid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'pagado')
                ->sum('precio');
            $en_proceso = Accion::where('cliente_id', $cid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'en_proceso')
                ->sum('precio');
            $pendiente = Accion::where('cliente_id', $cid)
                ->where('tipo', 'campana')
                ->where('estado_pago', 'pendiente')
                ->sum('precio');

            return response()->json([
                'total_acciones'       => Accion::where('cliente_id', $cid)->count(),
                'acciones_pendientes'  => Accion::where('cliente_id', $cid)->where('estado', 'pendiente')->count(),
                'acciones_completadas' => Accion::where('cliente_id', $cid)->where('estado', 'completada')->count(),
                'proxima_accion'       => Accion::where('cliente_id', $cid)
                                            ->where('estado', 'pendiente')
                                            ->where('fecha_inicio', '>=', now())
                                            ->orderBy('fecha_inicio')->first(),
                'total_gastado'        => round($gastado, 2),
                'total_en_proceso'     => round($en_proceso, 2),
                'total_pendiente'      => round($pendiente, 2),
            ]);
        }

        return response()->json([], 403);
    }

    public function ultimasAcciones(Request $request)
    {
        $user = $request->user();
        $query = Accion::with(['cliente']);

        if ($user->rol === 'admin') {
            if ($request->has('empresa_id')) $query->where('empresa_id', $request->empresa_id);
            if ($request->has('cliente_id')) $query->where('cliente_id', $request->cliente_id);
        } elseif ($user->rol === 'empresa') {
            $query->where('empresa_id', $user->empresa_id);
            if ($request->has('cliente_id')) $query->where('cliente_id', $request->cliente_id);
        } elseif ($user->rol === 'cliente') {
            $query->where('cliente_id', $user->cliente_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->limit(8)->get());
    }

    public function proximasAcciones(Request $request)
    {
        $user = $request->user();
        $query = Accion::with(['cliente'])
            ->where('estado', 'pendiente')
            ->where('fecha_inicio', '>=', now())
            ->orderBy('fecha_inicio');

        if ($user->rol === 'empresa') {
            $query->where('empresa_id', $user->empresa_id);
            if ($request->has('cliente_id')) $query->where('cliente_id', $request->cliente_id);
        } elseif ($user->rol === 'cliente') {
            $query->where('cliente_id', $user->cliente_id);
        }

        return response()->json($query->limit(8)->get());
    }

    public function clientesPorEstado(Request $request)
    {
        $user = $request->user();
        $query = Cliente::selectRaw('estado, COUNT(*) as total');

        if ($user->rol !== 'admin') {
            $query->where('empresa_id', $user->empresa_id);
        }

        return response()->json($query->groupBy('estado')->get());
    }

    public function empresasRecientes(Request $request)
    {
        return response()->json(
            Empresa::withCount(['clientes', 'usuarios'])
                ->orderBy('created_at', 'desc')
                ->limit(6)->get()
        );
    }

    public function ingresosAdmin(Request $request)
    {
        $cliente_id = $request->get('cliente_id');
        $mes = $request->get('mes', now()->month);
        $año = $request->get('año', now()->year);

        $query = Accion::where('tipo', 'campana')
            ->where('estado_pago', 'pagado')
            ->whereMonth('updated_at', $mes)
            ->whereYear('updated_at', $año);

        if ($cliente_id) $query->where('cliente_id', $cliente_id);

        $campanas = $query->with('cliente')->get();

        $basico  = Empresa::where('plan', 'basico')->where('activa', true)->count();
        $premium = Empresa::where('plan', 'premium')->where('activa', true)->count();

        return response()->json([
            'mensualidades'  => ($basico * 100) + ($premium * 300),
            'comisiones'     => round($campanas->sum('comision'), 2),
            'total'          => round((($basico * 100) + ($premium * 300)) + $campanas->sum('comision'), 2),
            'campanas'       => $campanas,
        ]);
    }

    public function ingresosEmpresa(Request $request)
    {
        $eid = $request->user()->empresa_id;
        $cliente_id = $request->get('cliente_id');

        $query = Accion::where('empresa_id', $eid)->where('tipo', 'campana');
        if ($cliente_id) $query->where('cliente_id', $cliente_id);

        $campanas = $query->with('cliente')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'total_facturado' => round($campanas->sum('precio'), 2),
            'ingresos_netos'  => round($campanas->where('estado_pago', 'pagado')->sum('ingreso_neto'), 2),
            'comisiones'      => round($campanas->where('estado_pago', 'pagado')->sum('comision'), 2),
            'pendiente'       => round($campanas->where('estado_pago', 'pendiente')->sum('precio'), 2),
            'campanas'        => $campanas,
        ]);
    }
}
