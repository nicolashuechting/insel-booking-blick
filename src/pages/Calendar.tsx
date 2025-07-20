import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Calendar() {
  const currentMonth = new Date().toLocaleDateString('de-DE', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Platzhalter für Kalenderdaten
  const calendarData = [
    { property: "Juist", bookings: 3, nextBooking: "15.01.2025" },
    { property: "Norderney", bookings: 2, nextBooking: "20.01.2025" },
    { property: "Baltrum", bookings: 1, nextBooking: "25.01.2025" },
    { property: "Anne 1", bookings: 4, nextBooking: "18.01.2025" },
  ];

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Kalenderübersicht
            </h1>
            <p className="text-muted-foreground">
              Alle Buchungen im Überblick für {currentMonth}
            </p>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Kalender Platzhalter */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Monatsübersicht {currentMonth}</CardTitle>
            <CardDescription>
              Detaillierte Kalenderansicht wird in der nächsten Version implementiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {calendarData.map((item) => (
                <Card key={item.property} className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{item.property}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Buchungen:</span>
                      <Badge variant="secondary">{item.bookings}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nächste:</span>
                      <span className="text-sm font-medium">{item.nextBooking}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">Kommende Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Die vollständige Kalenderansicht wird folgende Funktionen enthalten:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Monatskalender mit allen Wohnungen untereinander</li>
                  <li>Einzelwohnungsansicht pro Kalender</li>
                  <li>iCal-Import Integration</li>
                  <li>Drag & Drop für Buchungen</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}