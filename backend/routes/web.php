<?php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/test', function () {
    return 'laravel ok';
});