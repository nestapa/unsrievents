import { getUserRegistrations } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, CalendarDays, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const registrations = await getUserRegistrations();
  
  // Filter for portfolio (e.g., only confirmed ones or past events if we had logic for it. Currently, we just show confirmed)
  const portfolio = registrations.filter((reg: any) => reg.status === "confirmed");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">PORTOFOLIO <span className="text-primary italic">ACARA.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Rekam jejak dan sertifikasi acara yang telah Anda selesaikan.</p>
        </div>
      </div>

      <div className="space-y-6">
         {portfolio.map((reg: any, idx: number) => (
           <Card key={reg.id} className="bg-card/40 backdrop-blur-xl border-border/50 group hover:border-primary/50 transition-all overflow-hidden shadow-lg p-1">
             <div className="bg-secondary/50 rounded-[calc(var(--radius)-4px)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                 <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex flex-col items-center justify-center font-black text-white shadow-lg shrink-0">
                    <Trophy className="h-6 w-6 md:h-8 md:w-8 mb-1" />
                    <span className="text-[10px] tracking-widest opacity-80">PRO</span>
                 </div>
                 <div>
                    <Badge variant="outline" className="font-black text-[10px] tracking-widest text-emerald-500 border-emerald-500/20 uppercase mb-2">
                       COMPLETED
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase group-hover:text-primary transition-colors">{reg.event.title}</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                       <CalendarDays className="h-4 w-4" /> {new Date(reg.event.date!).toLocaleDateString()} • {reg.event.organizer?.name}
                    </p>
                 </div>
               </div>
               
               <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                 <Button variant="outline" className="w-full md:w-auto h-10 font-black tracking-widest uppercase text-[10px] gap-2 hover:bg-primary/5 hover:text-primary border-2">
                   <ExternalLink className="h-3 w-3" /> DETAIL
                 </Button>
                 <Button className="w-full md:w-auto h-10 font-black tracking-widest uppercase text-[10px] gap-2 shadow-lg shadow-primary/20">
                   <Download className="h-3 w-3" /> SERTIFIKAT
                 </Button>
               </div>
             </div>
           </Card>
         ))}
         
         {portfolio.length === 0 && (
           <Card className="bg-card/40 backdrop-blur-xl border-border/50 p-12 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-black uppercase tracking-tight">Belum Ada Portofolio</h3>
              <p className="text-muted-foreground font-medium mt-2">Ikuti acara dan dapatkan konfirmasi untuk membangun rekam jejak Anda.</p>
           </Card>
         )}
      </div>
    </div>
  );
}
