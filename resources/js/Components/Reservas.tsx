import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, ClockIcon, UserIcon, PlusCircle } from 'lucide-react'

interface Reservation {
    id: number;
    date: string;
    time: string;
    guests: number;
}

const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

const MAX_CAPACITY = 20

export default function Reservas() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState('')
    const [guests, setGuests] = useState('1')
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (date && time) {
            const newReservation: Reservation = {
                id: Date.now(),
                date: date.toISOString().split('T')[0],
                time,
                guests: parseInt(guests)
            }
            setReservations([...reservations, newReservation])
            setDate(undefined)
            setTime('')
            setGuests('1')
            setIsCalendarOpen(false)
        }
    }

    const getOccupancy = (date: string, time: string) => {
        return reservations
            .filter(r => r.date === date && r.time === time)
            .reduce((sum, r) => sum + r.guests, 0)
    }

    const getCardColor = (occupancy: number) => {
        if (occupancy > 15) return "bg-red-100 dark:bg-red-900"
        if (occupancy > 5) return "bg-yellow-100 dark:bg-yellow-900"
        return "bg-green-100 dark:bg-green-900"
    }

    const availableSlots = (date: string) => {
        return timeSlots.filter(slot => {
            const occupancy = getOccupancy(date, slot)
            return occupancy < MAX_CAPACITY
        })
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Reservas de Gimnasio</h1>
            <Card className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reservas Actuales</CardTitle>
                    <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only">Nueva Reserva</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Nueva Reserva</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Fecha</Label>
                            <div>
                            <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border"
                                        disabled={(date) => date < new Date()}
                                    />
                            </div>
                                </div>
                                {date && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="time">Hora</Label>
                                            <Select value={time} onValueChange={setTime}>
                                                <SelectTrigger id="time">
                                                    <SelectValue placeholder="Seleccione la hora" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableSlots(date.toISOString().split('T')[0]).map((slot) => (
                                                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guests">Número de personas</Label>
                                            <Select value={guests} onValueChange={setGuests}>
                                                <SelectTrigger id="guests">
                                                    <SelectValue placeholder="Seleccione el número de personas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit" className="w-full">Crear Reserva</Button>
                                    </>
                                )}
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        {reservations.length === 0 ? (
                            <p className="text-center text-muted-foreground">No hay reservas.</p>
                        ) : (
                            <ul className="space-y-4">
                                {reservations
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time))
                                    .map((reservation) => {
                                        const occupancy = getOccupancy(reservation.date, reservation.time)
                                        const cardColor = getCardColor(occupancy)
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
                                        )
                                    })}
                            </ul>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
