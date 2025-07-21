import { useState } from 'react';
import { properties } from '@/data/mockData';
import { BookingFormData } from '@/types';
import { DashboardHeader } from '@/components/DashboardHeader';
import { HouseSection } from '@/components/HouseSection';
import { BookingDialog } from '@/components/BookingDialog';
import { useBookings } from '@/hooks/useBookings';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { bookings, loading, addBooking } = useBookings();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>();

  const handleAddBooking = async (data: BookingFormData) => {
    await addBooking(data);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowBookingDialog(true);
  };

  const handleViewCalendar = () => {
    // Navigate to calendar view - will be implemented
  };

  const upstalsboomProperties = properties.filter(p => p.house === 'Upstalsboom');
  const hausAnneProperties = properties.filter(p => p.house === 'Haus Anne');

  if (loading) {
    return (
      <div className="bg-[var(--gradient-subtle)] min-h-full">
        <div className="container mx-auto p-6 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--gradient-subtle)] min-h-full">
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