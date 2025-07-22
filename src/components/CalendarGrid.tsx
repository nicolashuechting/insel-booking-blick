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

  // Generate more days for infinite scrolling
  const generateDays = useCallback(() => {
    const days = [];
    for (let i = -30; i < 90; i++) { // Show 30 days before and 90 days after
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const days = generateDays();
  const noDogApartments = ["Norderney", "Anne 2", "Anne 4", "Anne 5"];

  // Scroll to "today" on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const todayIndex = 30; // Today is at index 30 in our array
      const dayWidth = 48; // w-12 = 48px
      const visibleDays = 12;
      const scrollPosition = todayIndex * dayWidth - (visibleDays * dayWidth) / 2;
      scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  }, []);

  const getBookingsForProperty = (propertyName: string) => {
    return bookings.filter(booking => booking.property_id === propertyName);
  };

  const calculateBookingPosition = (booking: Booking) => {
    const startDate = new Date(booking.check_in);
    const endDate = new Date(booking.check_out);
    const firstDay = days[0];
    
    const daysDiff = Math.floor((startDate.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const startCol = Math.max(0, daysDiff);
    
    const bookingDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const endCol = Math.min(days.length - 1, startCol + bookingDays);
    const span = endCol - startCol + 1;
    
    return { startCol, span, visible: startCol < days.length && endCol >= 0 };
  };

  const handleMouseDown = (propertyName: string, dayIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectionStart({ property: propertyName, dayIndex });
    setSelectionEnd({ property: propertyName, dayIndex });
  };

  const handleMouseEnter = (propertyName: string, dayIndex: number) => {
    if (isSelecting && selectionStart && selectionStart.property === propertyName) {
      setSelectionEnd({ property: propertyName, dayIndex });
    }
  };

  const handleMouseUp = () => {
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
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, selectionStart, selectionEnd]);

  const getSelectionStyle = (propertyName: string, dayIndex: number) => {
    if (!isSelecting || !selectionStart || !selectionEnd || selectionStart.property !== propertyName) {
      return {};
    }
    
    const startIndex = Math.min(selectionStart.dayIndex, selectionEnd.dayIndex);
    const endIndex = Math.max(selectionStart.dayIndex, selectionEnd.dayIndex);
    
    if (dayIndex >= startIndex && dayIndex <= endIndex) {
      return { backgroundColor: 'hsl(var(--primary) / 0.2)' };
    }
    
    return {};
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden rounded-lg">
      <div className="overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-primary" ref={scrollContainerRef}>
        <div style={{ minWidth: `${days.length * 48}px` }}>
          {/* Header with dates */}
          <div className="flex border-b border-border">
            <div className="w-48 p-4 bg-muted/50 font-semibold text-sm flex-shrink-0">
              Wohnung
            </div>
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
                
                <div className="flex-1 relative min-h-[60px]">
                  <div className="flex relative">
                    {/* Day slots */}
                    {days.map((day, dayIndex) => (
                      <div 
                        key={dayIndex} 
                        className="w-12 border-l border-border flex-shrink-0 h-16 cursor-crosshair hover:bg-primary/5 transition-colors select-none"
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
                          className="absolute top-2 h-12 bg-primary/80 border border-primary rounded-md flex items-center justify-between px-2 cursor-pointer hover:bg-primary/90 transition-colors z-10"
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
                              <span>2</span> {/* Default for now, will be enhanced with actual data */}
                            </div>
                            <div className="flex items-center gap-1">
                              <Baby className="h-3 w-3" />
                              <span>0</span> {/* Default for now, will be enhanced with actual data */}
                            </div>
                            <Dog className="h-3 w-3" /> {/* Show/hide based on actual data later */}
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
    </div>
  );
}