import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Sparkles,
  Zap,
  ArrowUpRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPanitiaEvents, getPanitiaRegistrations } from "@/lib/actions";
import { CopyButton } from "@/components/copy-button";

export default async function PanitiaDashboard() {
  const myEvents = await getPanitiaEvents();
  const myRegistrations = await getPanitiaRegistrations();

  const totalPeserta = myEvents.reduce((acc: number, e: any) => acc + (e.seats - e.remainingSeats), 0);
  const acaraAktif = myEvents.length;
  const kapasitasTotal = myEvents.reduce((acc: number, e: any) => acc + e.seats, 0);
  const totalPendaftarBaru = myRegistrations.filter((r: any) => r.status === "pending").length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black mb-2 uppercase tracking-widest text-xs">
            <Zap className="h-4 w-4 fill-primary" /> Committee Control Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">PANITIA <span className="text-primary italic">CORE.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Kelola acaramu dengan efisien dan pantau pendaftaran secara real-time.</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "TOTAL PESERTA", value: totalPeserta.toLocaleString(), icon: Users, trend: "Aktif", isUp: true, color: "text-blue-400" },
            { label: "ACARA AKTIF", value: acaraAktif.toLocaleString(), icon: CalendarCheck, trend: "Live", isUp: true, color: "text-emerald-400" },
            { label: "KAPASITAS TOTAL", value: kapasitasTotal.toLocaleString(), icon: TrendingUp, trend: "Max", isUp: true, color: "text-purple-400" },
            { label: "PENDING REVIEW", value: totalPendaftarBaru.toLocaleString(), icon: ClipboardList, trend: "Need Action", isUp: false, color: "text-amber-400" },
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
          <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden">
            <CardHeader className="pb-8">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="text-2xl font-black tracking-tight uppercase italic">PENDAFTAR TERBARU</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Peserta yang baru mendaftar di acaramu.</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                 {myRegistrations.slice(0, 5).map((reg: any, i: number) => {
                   return (
                     <div key={i} className="flex items-center justify-between p-4 bg-secondary border-b border-border/50 last:border-0 hover:bg-muted transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-white shadow-lg">
                           {reg.user.name?.[0]}
                         </div>
                         <div>
                           <p className="font-black text-sm tracking-tight uppercase">{reg.user.name}</p>
                           <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-wider">
                             Event: {reg.event.title}
                           </p>
                         </div>
                       </div>
                       <Badge variant="outline" className={cn(
                         "font-black text-[10px] tracking-widest px-3 py-1 bg-secondary rounded-lg border-2",
                         reg.status === "confirmed" ? "text-emerald-400 border-emerald-400/20" : reg.status === "pending" ? "text-amber-400 border-amber-400/20" : "text-destructive border-destructive/20"
                       )}>
                         {reg.status?.toUpperCase()}
                       </Badge>
                     </div>
                   )
                 })}
                 {myRegistrations.length === 0 && (
                   <div className="p-8 text-center text-muted-foreground font-bold italic">Belum ada pendaftar.</div>
                 )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-purple-700 text-white border-none shadow-xl overflow-hidden relative">
             <div className="absolute -bottom-10 -right-10 opacity-20">
                <Sparkles className="h-40 w-40" />
             </div>
             <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                <h3 className="font-black text-2xl tracking-tighter uppercase mb-4 leading-tight">GAK <br />PUNYA <br />IDE?</h3>
                <div className="bg-black/20 p-3 rounded-lg border border-white/20 mb-2 select-all cursor-text">
                  <p className="text-xs opacity-90 leading-relaxed font-medium font-mono">
                    "Tolong buatkan deskripsi acara yang menarik dan kekinian untuk kegiatan kampus saya. Nama acaranya [NAMA ACARA]. Buat dengan gaya bahasa profesional tapi asik, dan sertakan benefit mengikutinya."
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <CopyButton textToCopy='"Tolong buatkan deskripsi acara yang menarik dan kekinian untuk kegiatan kampus saya. Nama acaranya [NAMA ACARA]. Buat dengan gaya bahasa profesional tapi asik, dan sertakan benefit mengikutinya."' />
                  <Link href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="font-black text-[10px] tracking-widest border-b-2 border-white/50 hover:border-white transition-colors text-white">TANYA CHATGPT →</Link>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
