import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  MapPin, 
  Ticket, 
  Trophy, 
  Sparkles,
  Zap,
  ArrowUpRight,
  UserCheck,
  History,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getUserRegistrations } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const registrations = await getUserRegistrations();
  const userName = session.user.name.split(" ")[0].toUpperCase();
  
  const totalJoined = registrations.length;
  const activityPoints = totalJoined * 100;
  const upcomingEvents = registrations.filter((reg: any) => reg.status === "confirmed").length;
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black mb-2 uppercase tracking-widest text-xs">
            <UserCheck className="h-4 w-4 text-primary" /> Explorer Control Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">USER <span className="text-primary italic">CORE.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Pantau agenda acaramu, sertifikat, dan poin aktivitas secara real-time.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/events">
             <Button className="h-12 px-6 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
               <Zap className="h-5 w-5" /> EXPLORE EVENTS
             </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "EVENTS JOINED", value: totalJoined.toLocaleString(), icon: Ticket, trend: "Active", isUp: true, color: "text-blue-400" },
          { label: "UPCOMING", value: upcomingEvents.toLocaleString(), icon: CalendarDays, trend: "Soon", isUp: true, color: "text-emerald-400" },
          { label: "CERTIFICATES", value: totalJoined.toLocaleString(), icon: Trophy, trend: "Earned", isUp: true, color: "text-purple-400" },
          { label: "ACTIVITY PTS", value: activityPoints.toLocaleString(), icon: Activity, trend: "Master", isUp: true, color: "text-amber-400" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden group p-1">
            <div className="bg-secondary p-6 rounded-[calc(var(--radius)-4px)]">
                <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">{stat.label}</CardTitle>
                    <div className={cn("p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors", stat.color)}>
                        <stat.icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-4xl font-black tracking-tighter mb-2">{stat.value}</div>
                <div className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black", stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                        {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : null}
                        {stat.trend}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">STATUS</span>
                </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black tracking-tight uppercase italic">UPCOMING AGENDA</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Acara yang akan Anda hadiri dalam waktu dekat.</CardDescription>
               </div>
               <Link href="/user/registrations">
                 <Button variant="ghost" className="h-8 text-xs font-black tracking-widest text-primary hover:bg-primary/5">VIEW FULL</Button>
               </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/50 overflow-hidden">
               {registrations.slice(0, 5).map((reg: any, i: number) => {
                 return (
                   <div key={i} className="flex items-center justify-between p-4 bg-secondary border-b border-border/50 last:border-0 hover:bg-muted transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-foreground shadow-lg">
                         <CalendarDays className="h-5 w-5 text-white" />
                       </div>
                       <div>
                         <p className="font-black text-sm tracking-tight uppercase">{reg.event.title}</p>
                         <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-wider">
                           {new Date(reg.event.date!).toLocaleDateString()} • {reg.event.location}
                         </p>
                       </div>
                     </div>
                     <Badge variant="outline" className={cn(
                       "font-black text-[10px] tracking-widest px-3 py-1 bg-secondary rounded-lg border-2 uppercase",
                       reg.status === "confirmed" ? "text-emerald-500 border-emerald-500/20" : reg.status === "pending" ? "text-amber-500 border-amber-500/20" : "text-destructive border-destructive/20"
                     )}>
                       {reg.status}
                     </Badge>
                   </div>
                 )
               })}
               {registrations.length === 0 && (
                 <div className="p-8 text-center text-muted-foreground font-bold italic">Belum ada agenda terdaftar.</div>
               )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-purple-700 text-white border-none shadow-2xl overflow-hidden relative">
           <div className="absolute -bottom-10 -right-10 opacity-20">
              <Sparkles className="h-40 w-40" />
           </div>
           <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
              <h3 className="font-black text-2xl tracking-tighter uppercase mb-4 leading-tight">EXPLORE <br />MORE <br />EVENTS</h3>
              <p className="text-sm opacity-90 leading-relaxed font-bold uppercase tracking-tight">
                "Tingkatkan skill dan perbanyak relasi dengan mengikuti berbagai acara di kampus."
              </p>
              <Link href="/events" className="inline-block mt-6 font-black text-[10px] tracking-widest border-b-2 border-border/50 hover:border-white transition-colors w-fit">FIND EVENTS →</Link>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
