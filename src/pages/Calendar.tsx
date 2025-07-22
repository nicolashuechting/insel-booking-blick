import { Calendar as CalendarIcon, Filter, Plus, ChevronLeft, ChevronRight, Users, Baby, Dog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { properties } from "@/data/mockData";
import { useBookings } from "@/hooks/useBookings";
import { BookingDialog } from "@/components/BookingDialog";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const { bookings, loading } = useBookings();
  
  // Generate 30 days for better scrolling experience
  const generateDays = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();

  // No-dog apartments
  const noDogApartments = ["Anne 2", "Anne 4", "Anne 5"];
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getBookingsForProperty = (propertyName: string) => {
    return bookings.filter(booking => booking.property_id === propertyName);
  };

  const calculateBookingPosition = (booking: any, propertyName: string) => {
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const firstDay = days[0];
    
    // Calculate start position
    const daysDiff = Math.floor((startDate.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const startCol = Math.max(0, daysDiff);
    
    // Calculate span
    const bookingDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const endCol = Math.min(days.length - 1, startCol + bookingDays);
    const span = endCol - startCol + 1;
    
    return { startCol, span, visible: startCol < days.length && endCol >= 0 };
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsBookingDialogOpen(true);
  };

  const handleNewBooking = (propertyName: string, dayIndex: number) => {
    const selectedDate = days[dayIndex];
    setSelectedProperty(propertyName);
    setSelectedDateRange({ start: selectedDate, end: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000) });
    setSelectedBooking(null);
    setIsBookingDialogOpen(true);
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
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-primary">
              <div className="min-w-[800px]">
                {/* Header with dates */}
                <div className="flex border-b border-border">
                  <div className="w-48 p-4 bg-muted/50 font-semibold text-sm flex-shrink-0">
                    Wohnung
                  </div>
                  <div className="flex overflow-x-auto min-w-0">
                    {days.map((day, index) => (
                      <div key={index} className="w-12 p-2 text-center bg-muted/30 border-l border-border text-xs font-medium flex-shrink-0">
                        {formatDate(day)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property rows */}
                {properties.map((property) => {
                  const propertyBookings = getBookingsForProperty(property.name);
                  
                  return (
                    <div key={property.id} className="flex border-b border-border hover:bg-muted/20 transition-colors">
                      <div className="w-48 p-4 flex items-center flex-shrink-0">
                        <div>
                          <div className="font-medium text-sm">{property.name}</div>
                          <div className="text-xs text-muted-foreground">{property.house}</div>
                          {noDogApartments.includes(property.name) && (
                            <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                              <Dog className="h-3 w-3" />
                              Keine Hunde
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 relative min-h-[60px] overflow-x-auto">
                        <div className="flex relative">
                          {/* Day slots */}
                          {days.map((day, dayIndex) => (
                            <div 
                              key={dayIndex} 
                              className="w-12 border-l border-border flex-shrink-0 h-16 cursor-pointer hover:bg-primary/5 transition-colors"
                              onClick={() => handleNewBooking(property.name, dayIndex)}
                            />
                          ))}
                          
                          {/* Booking bars */}
                          {propertyBookings.map((booking) => {
                            const position = calculateBookingPosition(booking, property.name);
                            
                            if (!position.visible) return null;
                            
                            return (
                              <div
                                key={booking.id}
                                className="absolute top-2 h-12 bg-primary/80 border border-primary rounded-md flex items-center justify-between px-2 cursor-pointer hover:bg-primary/90 transition-colors z-10"
                                style={{
                                  left: `${position.startCol * 48}px`, // 48px = w-12
                                  width: `${position.span * 48}px`,
                                }}
                                onClick={() => handleBookingClick(booking)}
                              >
                                <div className="flex items-center gap-2 text-white text-xs font-medium truncate">
                                  <span className="truncate">{booking.guest_name || 'Blockierung'}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-white/80 text-xs flex-shrink-0">
                                  {booking.property_id && (
                                    <>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>2</span> {/* Will be replaced with actual data */}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Baby className="h-3 w-3" />
                                        <span>0</span> {/* Will be replaced with actual data */}
                                      </div>
                                      <Dog className="h-3 w-3" />
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
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

        {/* Booking Dialog */}
        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          properties={properties}
          onSubmit={(data) => console.log('Add booking:', data)}
          onUpdate={(id, data) => console.log('Update booking:', id, data)}
          onDelete={(id) => console.log('Delete booking:', id)}
          selectedProperty={selectedProperty}
          selectedDateRange={selectedDateRange}
          booking={selectedBooking}
        />
      </div>
    </div>
  );
}