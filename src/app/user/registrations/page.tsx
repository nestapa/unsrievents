import { getUserRegistrations } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, MapPin } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserRegistrationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const registrations = await getUserRegistrations();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">STATUS <span className="text-primary italic">PENDAFTARAN.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Pantau status tiket dan agenda acara yang Anda ikuti.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registrations.map((reg: any) => (
          <Card key={reg.id} className="bg-card/40 backdrop-blur-xl border-border/50 group hover:border-primary/50 transition-all overflow-hidden shadow-xl p-1">
             <div className="bg-secondary h-full rounded-[calc(var(--radius)-4px)] p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <Badge variant="outline" className="font-black text-[10px] tracking-widest text-primary border-primary/20 uppercase">{reg.event.category}</Badge>
                   <Badge 
                     className={cn(
                       "font-black text-[10px] tracking-widest uppercase",
                       reg.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : reg.status === "pending" ? "bg-amber-500/20 text-amber-500" : "bg-destructive/20 text-destructive"
                     )}
                   >
                     {reg.status}
                   </Badge>
                </div>
                <h3 className="text-lg font-black tracking-tight uppercase line-clamp-2 mb-2 group-hover:text-primary transition-colors">{reg.event.title}</h3>
                <div className="space-y-2 mt-4 mb-6">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                      <CalendarDays className="h-3 w-3" /> {new Date(reg.event.date!).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> <span className="truncate">{reg.event.location}</span>
                    </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                   <Button disabled={reg.status !== "confirmed"} className="w-full h-10 text-[10px] font-black tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase disabled:opacity-50 disabled:pointer-events-none">
                     {reg.status === "confirmed" ? "E-TICKET" : reg.status === "pending" ? "MENUNGGU" : "DIBATALKAN"}
                   </Button>
                </div>
             </div>
          </Card>
        ))}
        {registrations.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground font-bold italic">Belum ada pendaftaran acara yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
