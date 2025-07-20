import { useState } from 'react';
import { properties, mockBookings } from '@/data/mockData';
import { BookingFormData } from '@/types';
import { DashboardHeader } from '@/components/DashboardHeader';
import { HouseSection } from '@/components/HouseSection';
import { BookingDialog } from '@/components/BookingDialog';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [bookings, setBookings] = useState(mockBookings);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>();
  const { toast } = useToast();

  const handleAddBooking = (data: BookingFormData) => {
    const newBooking = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    const property = properties.find(p => p.id === data.property_id);
    const actionType = data.source === 'blocked' ? 'Blockierung' : 'Buchung';
    
    toast({
      title: `${actionType} hinzugefügt`,
      description: `${actionType} für ${property?.name} wurde erfolgreich erstellt.`,
    });
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowBookingDialog(true);
  };

  const handleViewCalendar = () => {
    toast({
      title: "Kalenderansicht",
      description: "Die Kalenderansicht wird in einer zukünftigen Version verfügbar sein.",
    });
  };

  const upstalsboomProperties = properties.filter(p => p.house === 'Upstalsboom');
  const hausAnneProperties = properties.filter(p => p.house === 'Haus Anne');

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader 
          bookings={bookings}
          onAddBooking={() => setShowBookingDialog(true)}
          onViewCalendar={handleViewCalendar}
        />

        <div className="space-y-8">
          <HouseSection
            houseName="Haus Upstalsboom"
            properties={upstalsboomProperties}
            bookings={bookings}
            onPropertyClick={handlePropertyClick}
          />

          <HouseSection
            houseName="Haus Anne"
            properties={hausAnneProperties}
            bookings={bookings}
            onPropertyClick={handlePropertyClick}
          />
        </div>

        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          properties={properties}
          onSubmit={handleAddBooking}
          selectedPropertyId={selectedPropertyId}
        />
      </div>
    </div>
  );
}