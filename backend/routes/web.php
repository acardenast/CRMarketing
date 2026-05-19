<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'CRMarketing API',
        'status' => 'online',
        'base_url' => 'https://crmarketing.onrender.com/api'
    ]);
});

Route::get('/test', function () {
    return 'test backend';
});