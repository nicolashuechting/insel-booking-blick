import { Calendar as CalendarIcon, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { properties } from "@/data/mockData";
import { useBookings } from "@/hooks/useBookings";
import { BookingDialog } from "@/components/BookingDialog";
import { CalendarGrid } from "@/components/CalendarGrid";
import type { Booking } from "@/types";

export default function Calendar() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const { bookings, loading, addBooking, updateBooking, deleteBooking } = useBookings();

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDialogOpen(true);
  };

  const handleDateRangeSelect = (propertyName: string, startDate: Date, endDate: Date) => {
    // Find the property ID from the name
    const property = properties.find(p => p.name === propertyName);
    setSelectedProperty(property?.id || propertyName);
    setSelectedDateRange({ start: startDate, end: endDate });
    setSelectedBooking(null);
    setIsBookingDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-subtle)]">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="space-y-2">
            {[...Array(15)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Kalenderübersicht
            </h1>
            <p className="text-muted-foreground">
              Alle Buchungen aus Supabase im Gantt-Chart Format
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neue Buchung
            </Button>
          </div>
        </div>

        {/* Enhanced Calendar Grid */}
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle>Buchungskalender</CardTitle>
            <p className="text-sm text-muted-foreground">
              Markieren Sie einen Zeitraum mit der Maus, um eine neue Buchung zu erstellen
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <CalendarGrid
              bookings={bookings}
              onBookingClick={handleBookingClick}
              onDateRangeSelect={handleDateRangeSelect}
            />
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">Kalender Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ✅ Supabase-Integration aktiv - Daten werden live geladen!
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Buchungen werden automatisch aus Supabase geladen</li>
                  <li>Alle Änderungen werden in Echtzeit synchronisiert</li>
                  <li>Sichere Authentifizierung mit Row Level Security</li>
                  <li>Vollständige Buchungsverwaltung verfügbar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Dialog */}
        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          properties={properties}
          onSubmit={async (data) => {
            await addBooking(data);
            setIsBookingDialogOpen(false);
          }}
          onUpdate={async (id, data) => {
            await updateBooking(id, data);
            setIsBookingDialogOpen(false);
          }}
          onDelete={async (id) => {
            await deleteBooking(id);
            setIsBookingDialogOpen(false);
          }}
          selectedProperty={selectedProperty}
          selectedDateRange={selectedDateRange}
          booking={selectedBooking}
        />
      </div>
    </div>
  );
}