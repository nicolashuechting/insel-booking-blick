import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Booking, BookingFormData } from '@/types';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load bookings from Supabase
  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Booking interface
      const transformedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        property_id: booking.apartment_name, // Use apartment_name as property_id
        apartment_name: booking.apartment_name,
        guest_name: booking.guest_name || '',
        contact_info: booking.contact_info || '',
        check_in: booking.start_date, // Use start_date as primary
        check_out: booking.end_date, // Use end_date as primary
        start_date: booking.start_date,
        end_date: booking.end_date,
        ferry_time: booking.ferry_time || '',
        is_paid: booking.paid || booking.is_paid, // Use paid as primary
        paid: booking.paid,
        adults: booking.adults || 1,
        children: booking.children || 0,
        dog: booking.dog || false,
        source: (booking.source as 'manual' | 'blocked' | 'ical_1' | 'ical_2') || 'manual',
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      }));

      console.log('Loaded bookings from Supabase:', transformedBookings);

      setBookings(transformedBookings);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Fehler beim Laden',
        description: 'Buchungen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new booking
  const addBooking = async (data: BookingFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const bookingData = {
        user_id: user.id,
        apartment_name: data.property_id,
        guest_name: data.guest_name,
        contact_info: data.contact_info,
        start_date: data.check_in,
        end_date: data.check_out,
        ferry_time: data.ferry_time || null,
        paid: data.is_paid,
        source: data.source,
        adults: 1, // Default values, will be enhanced later
        children: 0,
        dog: false,
      };

      const { data: newBooking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      // Transform and add to local state
      const transformedBooking: Booking = {
        id: newBooking.id,
        property_id: newBooking.apartment_name,
        apartment_name: newBooking.apartment_name,
        guest_name: newBooking.guest_name || '',
        contact_info: newBooking.contact_info || '',
        check_in: newBooking.start_date,
        check_out: newBooking.end_date,
        start_date: newBooking.start_date,
        end_date: newBooking.end_date,
        ferry_time: newBooking.ferry_time || '',
        is_paid: newBooking.paid,
        paid: newBooking.paid,
        adults: newBooking.adults || 1,
        children: newBooking.children || 0,
        dog: newBooking.dog || false,
        source: (newBooking.source as 'manual' | 'blocked' | 'ical_1' | 'ical_2') || 'manual',
        created_at: newBooking.created_at,
        updated_at: newBooking.updated_at,
      };

      setBookings(prev => [transformedBooking, ...prev]);

      const actionType = data.source === 'blocked' ? 'Blockierung' : 'Buchung';
      toast({
        title: `${actionType} hinzugefügt`,
        description: `${actionType} wurde erfolgreich erstellt.`,
      });
    } catch (error: any) {
      console.error('Error adding booking:', error);
      toast({
        title: 'Fehler beim Hinzufügen',
        description: 'Buchung konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update booking
  const updateBooking = async (id: string, data: Partial<BookingFormData>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const updateData = {
        apartment_name: data.property_id,
        guest_name: data.guest_name,
        contact_info: data.contact_info,
        start_date: data.check_in,
        end_date: data.check_out,
        ferry_time: data.ferry_time || null,
        paid: data.is_paid,
        source: data.source,
      };

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === id 
          ? { ...booking, ...data, check_in: data.check_in!, check_out: data.check_out! }
          : booking
      ));

      toast({
        title: 'Buchung aktualisiert',
        description: 'Änderungen wurden erfolgreich gespeichert.',
      });
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Fehler beim Aktualisieren',
        description: 'Buchung konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBookings(prev => prev.filter(booking => booking.id !== id));

      toast({
        title: 'Buchung gelöscht',
        description: 'Buchung wurde erfolgreich entfernt.',
      });
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Fehler beim Löschen',
        description: 'Buchung konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load bookings when user changes
  useEffect(() => {
    loadBookings();
  }, [user]);

  return {
    bookings,
    loading,
    addBooking,
    updateBooking,
    deleteBooking,
    refreshBookings: loadBookings,
  };
};