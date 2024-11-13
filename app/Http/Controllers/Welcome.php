<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Reservation;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class Welcome extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'reservations' => Reservation::orderBy('date')
                                         ->orderBy('time')
                                         ->get()
        ]);
    }
}
