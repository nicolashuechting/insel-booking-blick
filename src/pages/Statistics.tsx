import { BarChart3, TrendingUp, Euro, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Statistics() {
  // Platzhalter-Daten für Statistiken
  const stats = [
    {
      title: "Gesamtumsatz",
      value: "€45,320",
      change: "+12.5%",
      icon: Euro,
      positive: true
    },
    {
      title: "Auslastung",
      value: "73%",
      change: "+8.2%",
      icon: Calendar,
      positive: true
    },
    {
      title: "Buchungen",
      value: "187",
      change: "-2.1%",
      icon: BarChart3,
      positive: false
    },
    {
      title: "Ø Aufenthalt",
      value: "4.2 Tage",
      change: "+0.3%",
      icon: TrendingUp,
      positive: true
    }
  ];

  const topProperties = [
    { name: "Juist", revenue: "€8,450", bookings: 24 },
    { name: "Anne 1", revenue: "€7,230", bookings: 21 },
    { name: "Norderney", revenue: "€6,890", bookings: 19 },
    { name: "Anne 2", revenue: "€6,120", bookings: 18 },
  ];

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Statistiken
          </h1>
          <p className="text-muted-foreground">
            Übersicht über Umsätze und Leistung Ihrer Ferienwohnungen
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge 
                    variant={stat.positive ? "default" : "secondary"}
                    className={stat.positive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs. Vormonat</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Properties */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Top Wohnungen</CardTitle>
            <CardDescription>
              Die erfolgreichsten Ferienwohnungen diesen Monat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={property.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.bookings} Buchungen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{property.revenue}</p>
                    <p className="text-sm text-muted-foreground">Umsatz</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">Geplante Statistik-Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Die Statistik-Seite wird nach Supabase-Integration erweitert um:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Interaktive Charts und Diagramme</li>
                  <li>Detaillierte Umsatzanalysen pro Zeitraum</li>
                  <li>Auslastungsstatistiken</li>
                  <li>Vergleiche zwischen Wohnungen und Häusern</li>
                  <li>Export-Funktionen für Berichte</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}