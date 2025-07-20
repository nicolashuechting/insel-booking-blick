import { Property, Booking } from '@/types';
import { PropertyCard } from './PropertyCard';
import { Home } from 'lucide-react';

interface HouseSectionProps {
  houseName: string;
  properties: Property[];
  bookings: Booking[];
  onPropertyClick: (propertyId: string) => void;
}

export function HouseSection({ houseName, properties, bookings, onPropertyClick }: HouseSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{houseName}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <span className="text-sm text-muted-foreground">
          {properties.length} Wohnungen
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => {
          const propertyBookings = bookings.filter(
            booking => booking.property_id === property.id
          );
          
          return (
            <PropertyCard
              key={property.id}
              property={property}
              bookings={propertyBookings}
              onPropertyClick={onPropertyClick}
            />
          );
        })}
      </div>
    </div>
  );
}