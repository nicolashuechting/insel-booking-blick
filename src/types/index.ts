export interface Property {
  id: string;
  name: string;
  house: 'Upstalsboom' | 'Haus Anne';
}

export interface Booking {
  id: string;
  property_id: string;
  guest_name: string;
  contact_info?: string;
  check_in: string;
  check_out: string;
  ferry_time?: string;
  is_paid: boolean;
  source: 'manual' | 'ical_1' | 'ical_2' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  property_id: string;
  guest_name: string;
  contact_info: string;
  check_in: string;
  check_out: string;
  ferry_time: string;
  is_paid: boolean;
  source: 'manual' | 'blocked';
}