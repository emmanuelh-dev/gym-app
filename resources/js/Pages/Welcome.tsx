import { buttonVariants } from '@/components/ui/button';
import Guest from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';

interface Reservation {
    id: number;
    date: string;
    time: string;
    guests: number;
}

const MAX_CAPACITY = 20;

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    reservations,
}: PageProps<{ laravelVersion: string; phpVersion: string; reservations: Reservation[] }>) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const getOccupancy = (date: string, time: string) => {
        return reservations
            .filter(r => r.date === date && r.time === time)
            .reduce((sum, r) => sum + r.guests, 0);
    };

    const getCardColor = (occupancy: number) => {
        if (occupancy > 15) return "bg-red-100";
        if (occupancy > 5) return "bg-yellow-100";
        return "bg-green-100";
    };

    return (
        <Guest>
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Reservas Actuales
                    </h2>
                    <a href="/reservations" className={`${buttonVariants({variant:'outline'})} `}>+</a>
                </div>

                <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {reservations.length === 0 ? (
                        <p>No hay reservas disponibles en este momento.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reservations.map((reservation) => {
                                const occupancy = getOccupancy(reservation.date, reservation.time);
                                const cardColor = getCardColor(occupancy);
                                return (
                                    <li key={reservation.id} className={`flex items-center justify-between p-4 border rounded-lg ${cardColor}`}>
                                        <div>
                                            <div className="flex items-center text-sm">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                <span>{reservation.date}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <ClockIcon className="mr-2 h-4 w-4" />
                                                <span>{reservation.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>{occupancy} / {MAX_CAPACITY}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </Guest>
    );
}
