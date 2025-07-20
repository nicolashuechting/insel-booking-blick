import { Property, Booking } from '@/types';

export const properties: Property[] = [
  // Haus Upstalsboom
  { id: '1', name: 'Juist', house: 'Upstalsboom' },
  { id: '2', name: 'Norderney', house: 'Upstalsboom' },
  { id: '3', name: 'Baltrum', house: 'Upstalsboom' },
  { id: '4', name: 'Langeoog', house: 'Upstalsboom' },
  { id: '5', name: 'Spiekeroog', house: 'Upstalsboom' },
  { id: '6', name: 'Wangerooge', house: 'Upstalsboom' },
  
  // Haus Anne
  { id: '7', name: 'Anne 1', house: 'Haus Anne' },
  { id: '8', name: 'Anne 2', house: 'Haus Anne' },
  { id: '9', name: 'Anne 3', house: 'Haus Anne' },
  { id: '10', name: 'Anne 4', house: 'Haus Anne' },
  { id: '11', name: 'Anne 5', house: 'Haus Anne' },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    property_id: '1',
    guest_name: 'Familie Müller',
    contact_info: 'mueller@email.de',
    check_in: '2024-07-20',
    check_out: '2024-07-27',
    ferry_time: '10:30',
    is_paid: true,
    source: 'ical_1',
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-15T10:00:00Z',
  },
  {
    id: '2',
    property_id: '2',
    guest_name: 'Herr Schmidt',
    contact_info: '+49 123 456789',
    check_in: '2024-07-22',
    check_out: '2024-07-29',
    ferry_time: '14:15',
    is_paid: false,
    source: 'manual',
    created_at: '2024-07-16T14:30:00Z',
    updated_at: '2024-07-16T14:30:00Z',
  },
  {
    id: '3',
    property_id: '7',
    guest_name: 'Familie Weber',
    contact_info: 'weber.family@email.de',
    check_in: '2024-07-25',
    check_out: '2024-08-01',
    ferry_time: '16:45',
    is_paid: true,
    source: 'ical_2',
    created_at: '2024-07-18T09:15:00Z',
    updated_at: '2024-07-18T09:15:00Z',
  },
  {
    id: '4',
    property_id: '4',
    guest_name: 'Wartung',
    contact_info: '',
    check_in: '2024-08-05',
    check_out: '2024-08-07',
    ferry_time: '',
    is_paid: false,
    source: 'blocked',
    created_at: '2024-07-19T11:00:00Z',
    updated_at: '2024-07-19T11:00:00Z',
  },
];