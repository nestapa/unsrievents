import { Navbar } from "@/components/navbar";
import { getAllEvents } from "@/lib/actions";
import { EventsGrid } from "./events-grid";

export default async function EventsPage() {
  const initialEvents = await getAllEvents();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-40 pb-20">
        <EventsGrid initialEvents={initialEvents as any} />
      </main>

      <footer className="bg-background py-16 border-t border-border">
        <div className="container max-w-6xl mx-auto px-6 text-center">
           <p className="text-muted-foreground font-black text-[10px] tracking-[0.2em] uppercase">
             © 2026 UNSRI Events. Managed with Passion.
           </p>
        </div>
      </footer>
    </div>
  );
}
