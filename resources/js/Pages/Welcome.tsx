import { buttonVariants } from '@/components/ui/button';
import Guest from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, ClockIcon, PlusCircle, UserIcon } from 'lucide-react';

const MAX_CAPACITY = 20;

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    summedReservations,
}: PageProps<{ laravelVersion: string; phpVersion: string; summedReservations: any }>) {

    // Convertir las reservas agrupadas en un array para iterar
    const flattenedReservations = Object.entries(summedReservations).flatMap(([date, times]: any) =>
        Object.entries(times).map(([time, guests]: any) => ({
            date,
            time,
            guests,
        }))
    );

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
                    <a href="/reservations" className={`${buttonVariants({ variant: 'default', size: 'icon' })} `}><PlusCircle /></a>
                </div>

                <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {flattenedReservations.length === 0 ? (
                        <p>No hay reservas disponibles en este momento.</p>
                    ) : (
                        <ul className="space-y-4">
                            {flattenedReservations.map((reservation: any, index: number) => {
                                const { date, time, guests } = reservation;
                                const cardColor = getCardColor(guests);
                                return (
                                    <li key={`${date}-${time}-${index}`} className={`flex items-center justify-between p-4 border rounded-lg ${cardColor}`}>
                                        <div>
                                            <div className="flex items-center text-sm">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                <span>{date}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <ClockIcon className="mr-2 h-4 w-4" />
                                                <span>{time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>{guests} / {MAX_CAPACITY}</span>
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
