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
        $reservations = Reservation::orderBy('date')
            ->where('date', '>=', now()->format('Y-m-d'))
            ->orderBy('time')
            ->get();
        $summedReservations = $reservations->groupBy('date')->map(function ($reservationsByDate) {
            return $reservationsByDate->groupBy('time')->map(function ($reservationsByTime) {
                return $reservationsByTime->sum('guests');
            });
        });

        return Inertia::render('Welcome', [
            'reservations' => $reservations,
            'summedReservations' => $summedReservations,
        ]);
    }
}
