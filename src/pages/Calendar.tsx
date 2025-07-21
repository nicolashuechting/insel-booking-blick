import { Calendar as CalendarIcon, Filter, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { properties } from "@/data/mockData";
import { useBookings } from "@/hooks/useBookings";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { bookings, loading } = useBookings();
  
  // Generate 12 days starting from current date
  const generateDays = () => {
    const days = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getBookingsForPropertyAndDate = (propertyId: string, date: Date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return booking.property_id === propertyId && 
             date >= checkIn && 
             date < checkOut;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
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

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
          <Button variant="ghost" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-lg font-semibold text-foreground">
            {currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </div>
          
          <Button variant="ghost" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Woodu-Style Calendar Grid */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle>Buchungskalender</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header with dates */}
                <div className="grid grid-cols-[200px_1fr] border-b border-border">
                  <div className="p-4 bg-muted/50 font-semibold text-sm">
                    Wohnung
                  </div>
                  <div className="grid grid-cols-12 gap-0">
                    {days.map((day, index) => (
                      <div key={index} className="p-2 text-center bg-muted/30 border-l border-border text-xs font-medium">
                        {formatDate(day)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property rows */}
                {properties.map((property) => (
                  <div key={property.id} className="grid grid-cols-[200px_1fr] border-b border-border hover:bg-muted/20 transition-colors">
                    <div className="p-4 flex items-center">
                      <div>
                        <div className="font-medium text-sm">{property.name}</div>
                        <div className="text-xs text-muted-foreground">{property.house}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-0 relative min-h-[60px]">
                      {days.map((day, dayIndex) => {
                        const bookings = getBookingsForPropertyAndDate(property.id, day);
                        const hasBooking = bookings.length > 0;
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className="border-l border-border p-1 flex items-center justify-center relative cursor-pointer hover:bg-primary/5 transition-colors"
                          >
                            {hasBooking && (
                              <div className="w-full h-8 bg-primary/20 border border-primary/40 rounded-sm flex items-center justify-center group">
                                <div className="text-xs text-primary font-medium truncate px-1">
                                  {bookings[0].guest_name}
                                </div>
                                {/* Tooltip on hover */}
                                <div className="absolute top-full left-0 mt-1 p-2 bg-popover border border-border rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs min-w-[150px]">
                                  <div className="font-medium">{bookings[0].guest_name}</div>
                                  <div className="text-muted-foreground">
                                    {new Date(bookings[0].check_in).toLocaleDateString('de-DE')} - {new Date(bookings[0].check_out).toLocaleDateString('de-DE')}
                                  </div>
                                  {bookings[0].source && (
                                    <div className="text-muted-foreground">
                                      Quelle: {bookings[0].source}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      </div>
    </div>
  );
}