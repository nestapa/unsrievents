"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CalendarDays, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Event {
    id: string;
    title: string;
    category: string;
    organizer?: string | any;
    date: Date;
    location: string;
    image?: string | null;
    price: string | null;
    seats: number;
}

export function EventsGrid({ initialEvents }: { initialEvents: Event[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = initialEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof event.organizer === 'string' && event.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black mb-4">
          <Sparkles className="h-5 w-5" />
          <span className="uppercase tracking-[0.3em] text-xs">Explore Unlimited Power</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
          THE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">EXPERIENCE.</span>
        </h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mt-12 bg-card/50 p-4 rounded-3xl border border-border backdrop-blur-xl max-w-4xl">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari acara, kategori, atau penyelenggara..." 
              className="pl-12 h-14 bg-secondary border-transparent rounded-2xl focus:border-primary/50 transition-all font-medium text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-14 px-8 rounded-2xl flex gap-2 font-black tracking-widest text-xs shadow-xl shadow-primary/10">
            <SlidersHorizontal className="h-4 w-4" /> FILTERS
          </Button>
        </div>
      </div>

      {/* Grid Acara */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="group relative bg-card/50 backdrop-blur-2xl border-border overflow-hidden hover:border-primary/50 transition-all duration-700 hover:translate-y-[-8px]">
            <div className="relative h-64 overflow-hidden">
              <Image 
                src={event.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop"} 
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              <div className="absolute top-6 left-6">
                <Badge className="bg-primary text-primary-foreground font-black px-3 py-1 rounded-md text-[10px] tracking-widest uppercase">
                  {event.category}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="relative -mt-12 pt-0 px-6">
              <div className="bg-card/95 backdrop-blur-md p-5 rounded-2xl border border-border shadow-2xl group-hover:border-primary/40 transition-all">
                <CardTitle className="text-xl font-black tracking-tight mb-1 line-clamp-1 leading-tight uppercase">
                  {event.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 font-black text-[10px] text-primary tracking-[0.2em] uppercase">
                  By {event.organizer?.name || 'Organizer'}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="px-8 pb-10 space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                  <p className="text-xs font-bold flex items-center gap-2 tracking-tight">
                    <CalendarDays className="h-3 w-3 text-primary" /> {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                  <p className="text-[10px] font-bold flex items-center gap-2 tracking-tight line-clamp-1">
                    <MapPin className="h-3 w-3 text-primary" /> {event.location}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex flex-col">
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Price</p>
                   <p className="text-xl font-black text-primary tracking-tighter">{event.price}</p>
                </div>
                <Link href={`/events/${event.id}`}>
                    <Button size="sm" className="h-10 px-6 rounded-xl font-black text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20">
                    REGISTER
                    </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="py-40 text-center">
          <h3 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">No events found.</h3>
          <p className="text-muted-foreground font-medium">Try another search or reset filters.</p>
          <Button variant="outline" className="mt-8 border-2 rounded-xl h-12 px-8 font-black text-xs uppercase" onClick={() => setSearchQuery("")}>
            RESET SEARCH
          </Button>
        </div>
      )}
    </div>
  );
}
