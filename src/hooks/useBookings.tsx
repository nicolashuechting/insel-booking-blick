import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Booking, BookingFormData } from '@/types';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load bookings from Firebase
  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const transformedBookings: Booking[] = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          property_id: data.apartment || data.property_id || '',
          apartment_name: data.apartment || data.apartment_name || '',
          guest_name: data.guestName || '',
          contact_info: data.email || '',
          check_in: data.checkIn || '',
          check_out: data.checkOut || '',
          start_date: data.checkIn || '',
          end_date: data.checkOut || '',
          ferry_time: data.ferry_time || '',
          is_paid: data.paid || false,
          paid: data.paid || false,
          adults: data.persons || 1,
          children: data.children || 0,
          dog: data.hasDog || false,
          source: data.source || 'manual',
          created_at: data.createdAt?.toDate?.() || new Date(),
          updated_at: data.updatedAt?.toDate?.() || new Date(),
        };
      });

      console.log('Loaded bookings from Firebase:', transformedBookings);
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
        userId: user.uid,
        apartment: data.property_id,
        guestName: data.guest_name,
        email: data.contact_info,
        checkIn: data.check_in,
        checkOut: data.check_out,
        ferry_time: data.ferry_time || null,
        paid: data.is_paid,
        source: data.source,
        persons: 1,
        children: 0,
        hasDog: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);

      const transformedBooking: Booking = {
        id: docRef.id,
        property_id: bookingData.apartment,
        apartment_name: bookingData.apartment,
        guest_name: bookingData.guestName || '',
        contact_info: bookingData.email || '',
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        start_date: bookingData.checkIn,
        end_date: bookingData.checkOut,
        ferry_time: bookingData.ferry_time || '',
        is_paid: bookingData.paid,
        paid: bookingData.paid,
        adults: bookingData.persons || 1,
        children: bookingData.children || 0,
        dog: bookingData.hasDog || false,
        source: bookingData.source,
        created_at: bookingData.createdAt,
        updated_at: bookingData.updatedAt,
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
        apartment: data.property_id,
        guestName: data.guest_name,
        email: data.contact_info,
        checkIn: data.check_in,
        checkOut: data.check_out,
        ferry_time: data.ferry_time || null,
        paid: data.is_paid,
        source: data.source,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'bookings', id), updateData);

      setBookings(prev => prev.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              ...data, 
              check_in: data.check_in || booking.check_in, 
              check_out: data.check_out || booking.check_out 
            }
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
      
      await deleteDoc(doc(db, 'bookings', id));

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
