import { Property, Booking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  bookings: Booking[];
  onPropertyClick: (propertyId: string) => void;
}

export function PropertyCard({ property, bookings, onPropertyClick }: PropertyCardProps) {
  const activeBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.check_out >= today;
  });

  const currentBooking = bookings.find(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.check_in <= today && booking.check_out >= today;
  });

  const nextBooking = bookings
    .filter(booking => booking.check_in > new Date().toISOString().split('T')[0])
    .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())[0];

  const getStatusColor = () => {
    if (currentBooking) {
      return currentBooking.source === 'blocked' ? 'bg-warning' : 'bg-success';
    }
    return 'bg-muted';
  };

  const getStatusText = () => {
    if (currentBooking) {
      return currentBooking.source === 'blocked' ? 'Blockiert' : 'Belegt';
    }
    return 'Verfügbar';
  };

  return (
    <Card 
      className="hover:shadow-[var(--shadow-medium)] transition-all duration-300 cursor-pointer group"
      onClick={() => onPropertyClick(property.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-4 w-4 text-primary" />
            {property.name}
          </CardTitle>
          <Badge 
            className={`${getStatusColor()} text-white border-0`}
          >
            {getStatusText()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{property.house}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {currentBooking && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">
                {currentBooking.source === 'blocked' ? 'Blockiert' : currentBooking.guest_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              bis {new Date(currentBooking.check_out).toLocaleDateString('de-DE')}
            </div>
          </div>
        )}

        {nextBooking && (
          <div className="p-3 rounded-lg bg-accent/30 border border-accent/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-accent-foreground" />
              <span className="font-medium text-sm">
                {nextBooking.source === 'blocked' ? 'Blockiert' : nextBooking.guest_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              ab {new Date(nextBooking.check_in).toLocaleDateString('de-DE')}
            </div>
          </div>
        )}

        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{activeBookings.length} Buchungen</span>
          <span className="group-hover:text-primary transition-colors">
            Klicken für Details →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}