<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::orderBy('date')
                                   ->orderBy('time')
                                   ->get();

        return Inertia::render('Reservations', [
            'reservations' => $reservations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required',
            'guests' => 'required|integer|min:1|max:5',
        ]);

        $occupancy = Reservation::where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->sum('guests');

        $timeSlot = TimeSlot::where('time', $validated['time'])->first();
        $maxCapacity = $timeSlot ? $timeSlot->max_capacity : 20;

        if ($occupancy + $validated['guests'] > $maxCapacity) {
            return back()->withErrors(['error' => 'La capacidad máxima ha sido excedida para este horario.']);
        }

        Reservation::create($validated);

        return back()->with('success', 'Reserva creada exitosamente.');
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return back()->with('success', 'Reserva eliminada exitosamente.');
    }
}
