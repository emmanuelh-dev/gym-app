import { useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { CalendarIcon, ClockIcon, UserIcon, PlusCircle } from 'lucide-react';

interface Reservation {
    id: number;
    date: string;
    time: string;
    guests: number;
}

const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const MAX_CAPACITY = 20;

export default function Reservations({ auth, reservations }: { auth: any, reservations: Reservation[] }) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        date: '',
        time: '',
        guests: '1',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('reservations.store'), {
            onSuccess: () => {
                reset('date', 'time', 'guests');
                setIsCalendarOpen(false);
            },
        });
    };

    const deleteReservation = (id: number) => {
        destroy(route('reservations.destroy', id));
    };

    const getOccupancy = (date: string, time: string) => {
        return reservations
            .filter(r => r.date === date && r.time === time)
            .reduce((sum, r) => sum + r.guests, 0);
    };

    const getCardColor = (occupancy: number) => {
        if (occupancy > 15) return "bg-red-100 dark:bg-red-900";
        if (occupancy > 5) return "bg-yellow-100 dark:bg-yellow-900";
        return "bg-green-100 dark:bg-green-900";
    };

    const availableSlots = (date: string) => {
        return timeSlots.filter(slot => {
            const occupancy = getOccupancy(date, slot);
            return occupancy < MAX_CAPACITY;
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reservas de Gimnasio</h2>}
        >
            <Head title="Reservas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Reservas Actuales</h3>
                                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <DialogTrigger asChild>
                                        <PrimaryButton className="ml-4">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Nueva Reserva
                                        </PrimaryButton>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Nueva Reserva</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="date" value="Fecha" />
                                                <TextInput
                                                    id="date"
                                                    type="date"
                                                    name="date"
                                                    value={data.date}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('date', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.date} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="time" value="Hora" />
                                                <select
                                                    id="time"
                                                    name="time"
                                                    value={data.time}
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    onChange={(e) => setData('time', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Seleccione la hora</option>
                                                    {availableSlots(data.date).map((slot) => (
                                                        <option key={slot} value={slot}>{slot}</option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.time} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="guests" value="Número de personas" />
                                                <select
                                                    id="guests"
                                                    name="guests"
                                                    value={data.guests}
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    onChange={(e) => setData('guests', e.target.value)}
                                                    required
                                                >
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <option key={num} value={num.toString()}>{num}</option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.guests} className="mt-2" />
                                            </div>

                                            <PrimaryButton className="w-full" disabled={processing}>
                                                Crear Reserva
                                            </PrimaryButton>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <ScrollArea className="h-[400px]">
                                {reservations.length === 0 ? (
                                    <p className="text-center text-gray-500">No hay reservas.</p>
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
                                                    <div className="flex items-center">
                                                        <div className="flex items-center text-sm mr-4">
                                                            <UserIcon className="mr-2 h-4 w-4" />
                                                            <span>{occupancy} / {MAX_CAPACITY}</span>
                                                        </div>
                                                        <PrimaryButton
                                                            onClick={() => deleteReservation(reservation.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Eliminar
                                                        </PrimaryButton>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
