import { useState, useRef, useEffect, useCallback } from "react";
import { Users, Baby, Dog } from "lucide-react";
import { properties } from "@/data/mockData";
import type { Booking } from "@/types";

interface CalendarGridProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onDateRangeSelect: (propertyName: string, startDate: Date, endDate: Date) => void;
}

export function CalendarGrid({ bookings, onBookingClick, onDateRangeSelect }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ property: string; dayIndex: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ property: string; dayIndex: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate days from today for the next 2 years (performance optimization)
  const generateDays = useCallback(() => {
    const days = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setFullYear(today.getFullYear() + 2); // Only 2 years ahead for better performance
    
    const currentDay = new Date(today);
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  }, []);

  const days = generateDays();
  const noDogApartments = ["Norderney", "Anne 2", "Anne 4", "Anne 5"];

  // Scroll to "today" on mount - start at beginning since we start from today
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  const getBookingsForProperty = useCallback((propertyName: string) => {
    return bookings.filter(booking => booking.apartment_name === propertyName || booking.property_id === propertyName);
  }, [bookings]);

  const calculateBookingPosition = useCallback((booking: Booking) => {
    const startDate = new Date(booking.start_date || booking.check_in);
    const endDate = new Date(booking.end_date || booking.check_out);
    const firstDay = days[0];
    
    const daysDiff = Math.floor((startDate.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const startCol = Math.max(0, daysDiff);
    
    const bookingDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const endCol = Math.min(days.length - 1, startCol + bookingDays);
    const span = endCol - startCol + 1;
    
    return { startCol, span, visible: startCol < days.length && endCol >= 0 };
  }, [days]);

  const handleMouseDown = useCallback((propertyName: string, dayIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectionStart({ property: propertyName, dayIndex });
    setSelectionEnd({ property: propertyName, dayIndex });
  }, []);

  const handleMouseEnter = useCallback((propertyName: string, dayIndex: number) => {
    if (isSelecting && selectionStart && selectionStart.property === propertyName) {
      setSelectionEnd({ property: propertyName, dayIndex });
    }
  }, [isSelecting, selectionStart]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectionStart && selectionEnd) {
      const startIndex = Math.min(selectionStart.dayIndex, selectionEnd.dayIndex);
      const endIndex = Math.max(selectionStart.dayIndex, selectionEnd.dayIndex);
      
      const startDate = days[startIndex];
      const endDate = new Date(days[endIndex]);
      endDate.setDate(endDate.getDate() + 1); // End date is exclusive
      
      onDateRangeSelect(selectionStart.property, startDate, endDate);
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isSelecting, selectionStart, selectionEnd, days, onDateRangeSelect]);

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleMouseUp]);

  const getSelectionStyle = useCallback((propertyName: string, dayIndex: number) => {
    if (!isSelecting || !selectionStart || !selectionEnd || selectionStart.property !== propertyName) {
      return {};
    }
    
    const startIndex = Math.min(selectionStart.dayIndex, selectionEnd.dayIndex);
    const endIndex = Math.max(selectionStart.dayIndex, selectionEnd.dayIndex);
    
    if (dayIndex >= startIndex && dayIndex <= endIndex) {
      return { backgroundColor: 'hsl(var(--primary) / 0.2)' };
    }
    
    return {};
  }, [isSelecting, selectionStart, selectionEnd]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden rounded-lg flex">
      {/* Fixed left column with property names */}
      <div className="w-48 flex-shrink-0 bg-muted/50">
        {/* Header for property names */}
        <div className="p-3 border-b border-border font-semibold text-sm">
          Wohnung
        </div>
        
        {/* Property names */}
        {properties.map((property) => (
          <div key={property.id} className="p-3 border-b border-border hover:bg-muted/20 transition-colors h-12 flex items-center">
            <div>
              <div className="font-medium text-sm">{property.name}</div>
              <div className="text-xs text-muted-foreground">{property.house}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable calendar content */}
      <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-primary" ref={scrollContainerRef} style={{ maxWidth: `${12 * 48}px` }}>
        <div style={{ minWidth: `${days.length * 48}px` }}>
          {/* Header with dates */}
          <div className="border-b border-border">
            <div className="flex">
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
              <div key={property.id} className="border-b border-border hover:bg-muted/20 transition-colors h-12 relative">
                <div className="flex relative h-full">
                  {/* Day slots */}
                  {days.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className="w-12 border-l border-border flex-shrink-0 h-full cursor-crosshair hover:bg-primary/5 transition-colors select-none"
                      style={getSelectionStyle(property.name, dayIndex)}
                      onMouseDown={(e) => handleMouseDown(property.name, dayIndex, e)}
                      onMouseEnter={() => handleMouseEnter(property.name, dayIndex)}
                    />
                  ))}
                  
                  {/* Booking bars */}
                  {propertyBookings.map((booking) => {
                    const position = calculateBookingPosition(booking);
                    
                    if (!position.visible) return null;
                    
                    return (
                      <div
                        key={booking.id}
                        className="absolute top-1 h-10 bg-primary/80 border border-primary rounded-md flex items-center justify-between px-2 cursor-pointer hover:bg-primary/90 transition-colors z-10"
                        style={{
                          left: `${position.startCol * 48}px`,
                          width: `${position.span * 48}px`,
                        }}
                        onClick={() => onBookingClick(booking)}
                      >
                        <div className="flex items-center gap-2 text-white text-xs font-medium truncate">
                          <span className="truncate">{booking.guest_name || 'Blockierung'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-white/80 text-xs flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{booking.adults || 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Baby className="h-3 w-3" />
                            <span>{booking.children || 0}</span>
                          </div>
                          {booking.dog && <Dog className="h-3 w-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}