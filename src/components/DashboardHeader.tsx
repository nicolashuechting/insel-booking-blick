import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Home, Users } from 'lucide-react';
import { Booking } from '@/types';

interface DashboardHeaderProps {
  bookings: Booking[];
  onAddBooking: () => void;
  onViewCalendar: () => void;
}

export function DashboardHeader({ bookings, onAddBooking, onViewCalendar }: DashboardHeaderProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const activeBookings = bookings.filter(booking => 
    booking.check_in <= today && booking.check_out >= today
  );
  
  const upcomingBookings = bookings.filter(booking => 
    booking.check_in > today
  ).length;
  
  const unpaidBookings = bookings.filter(booking => 
    !booking.is_paid && booking.source === 'manual' && booking.check_out >= today
  ).length;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Home className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Ferienwohnungs-Verwaltung</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Verwalten Sie Ihre 11 Wohnungen in Upstalsboom und Haus Anne
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      </div>

      {/* Stats and Actions */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <Users className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">Aktuell belegt</p>
              <p className="text-2xl font-bold text-success">{activeBookings.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Kommende Buchungen</p>
              <p className="text-2xl font-bold text-primary">{upcomingBookings}</p>
            </div>
          </div>
          
          {unpaidBookings > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <Badge variant="outline" className="border-warning text-warning">
                {unpaidBookings} unbezahlt
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onViewCalendar}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Kalenderansicht
          </Button>
          <Button 
            onClick={onAddBooking}
            className="flex items-center gap-2 bg-[var(--gradient-ocean)] hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Neue Buchung
          </Button>
        </div>
      </div>
    </div>
  );
}