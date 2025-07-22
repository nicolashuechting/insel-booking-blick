import { useState, useEffect } from 'react';
import { Property, BookingFormData, Booking } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Phone, Clock, CreditCard, Tag, Baby, Dog, Trash2 } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
  onSubmit: (data: BookingFormData) => void;
  onUpdate?: (id: string, data: Partial<BookingFormData>) => void;
  onDelete?: (id: string) => void;
  selectedPropertyId?: string;
  selectedProperty?: string;
  selectedDateRange?: { start: Date; end: Date } | null;
  booking?: Booking | null;
}

export function BookingDialog({ 
  open, 
  onOpenChange, 
  properties, 
  onSubmit,
  onUpdate,
  onDelete,
  selectedPropertyId,
  selectedProperty,
  selectedDateRange,
  booking
}: BookingDialogProps) {
  const [formData, setFormData] = useState<BookingFormData & { adults: number; children: number; dog: boolean }>({
    property_id: selectedPropertyId || selectedProperty || '',
    guest_name: '',
    contact_info: '',
    check_in: '',
    check_out: '',
    ferry_time: '',
    is_paid: false,
    source: 'manual',
    adults: 1,
    children: 0,
    dog: false,
  });

  // No-dog apartments
  const noDogApartments = ["Norderney", "Anne 2", "Anne 4", "Anne 5"];
  const isNoDogApartment = selectedProperty ? noDogApartments.includes(selectedProperty) : false;

  useEffect(() => {
    if (booking) {
      // Edit mode - populate form with booking data
      setFormData({
        property_id: booking.property_id,
        guest_name: booking.guest_name || '',
        contact_info: booking.contact_info || '',
        check_in: booking.check_in,
        check_out: booking.check_out,
        ferry_time: booking.ferry_time || '',
        is_paid: booking.is_paid,
        source: booking.source === 'ical_1' || booking.source === 'ical_2' ? 'manual' : booking.source,
        adults: 1, // Default values - will be replaced with actual data
        children: 0,
        dog: false,
      });
    } else if (selectedDateRange) {
      // New booking mode - set dates from selection
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        property_id: selectedProperty || '',
        check_in: formatDate(selectedDateRange.start),
        check_out: formatDate(selectedDateRange.end),
        dog: false, // Reset dog for no-dog apartments
      }));
    }
  }, [booking, selectedDateRange, selectedProperty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (booking && onUpdate) {
      onUpdate(booking.id, formData);
    } else {
      onSubmit(formData);
    }
    setFormData({
      property_id: selectedPropertyId || '',
      guest_name: '',
      contact_info: '',
      check_in: '',
      check_out: '',
      ferry_time: '',
      is_paid: false,
      source: 'manual',
      adults: 1,
      children: 0,
      dog: false,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (booking && onDelete) {
      onDelete(booking.id);
      onOpenChange(false);
    }
  };

  const groupedProperties = properties.reduce((acc, property) => {
    if (!acc[property.house]) {
      acc[property.house] = [];
    }
    acc[property.house].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Neue Buchung hinzufügen
          </DialogTitle>
          <DialogDescription>
            Fügen Sie eine neue Buchung oder Blockierung hinzu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="property">Wohnung</Label>
              <Select 
                value={formData.property_id} 
                onValueChange={(value) => setFormData({ ...formData, property_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wohnung auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedProperties).map(([house, props]) => (
                    <div key={house}>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        {house}
                      </div>
                      {props.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="source">Typ</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value: 'manual' | 'blocked') => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Buchung
                    </div>
                  </SelectItem>
                  <SelectItem value="blocked">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Blockierung
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="guest_name">
                {formData.source === 'blocked' ? 'Grund' : 'Gastname'}
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="guest_name"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  placeholder={formData.source === 'blocked' ? 'z.B. Wartung, Eigenbedarf' : 'Name des Gastes'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {formData.source === 'manual' && (
              <div className="col-span-2">
                <Label htmlFor="contact_info">Kontaktdaten</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_info"
                    value={formData.contact_info}
                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                    placeholder="E-Mail oder Telefon"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="check_in">Anreise</Label>
              <Input
                id="check_in"
                type="date"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="check_out">Abreise</Label>
              <Input
                id="check_out"
                type="date"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                required
              />
            </div>

            {formData.source === 'manual' && (
              <>
                <div className="grid grid-cols-3 gap-4 col-span-2">
                  <div>
                    <Label htmlFor="adults">Erwachsene</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adults"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="children">Kinder</Label>
                    <div className="relative">
                      <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="dog">Hund</Label>
                    <div className="flex items-center space-x-2 h-10">
                      <Checkbox 
                        id="dog"
                        checked={formData.dog}
                        disabled={isNoDogApartment}
                        onCheckedChange={(checked) => setFormData({ ...formData, dog: !!checked })}
                      />
                      <Dog className={`h-4 w-4 ${isNoDogApartment ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    {isNoDogApartment && (
                      <p className="text-xs text-orange-600 mt-1">Keine Hunde erlaubt</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="ferry_time">Fähruhrzeit</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ferry_time"
                      value={formData.ferry_time}
                      onChange={(e) => setFormData({ ...formData, ferry_time: e.target.value })}
                      placeholder="z.B. 10:30 oder 14:15"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_paid"
                      checked={formData.is_paid}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_paid: !!checked })}
                    />
                    <Label htmlFor="is_paid" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Bezahlt
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div>
              {booking && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit"
                className="bg-[var(--gradient-ocean)] hover:opacity-90"
              >
                {booking ? 'Aktualisieren' : (formData.source === 'blocked' ? 'Blockierung hinzufügen' : 'Buchung hinzufügen')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}