import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Filter,
  Zap,
  Activity,
  Users,
  UserCheck,
  CalendarDays,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminStats, getAdminChartData } from "@/lib/actions";
import { SimpleAreaChart, SimplePieChart } from "@/components/dashboard/charts";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const chartData = await getAdminChartData();

  if (!stats) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="h-20 w-20 text-red-500 mb-6 opacity-20" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h2>
              <p className="text-muted-foreground font-medium mt-2">Only system administrators can view this data.</p>
          </div>
      );
  }

  const { totalUsers, totalEvents, totalRegistrations, recentUsers } = stats;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black mb-2 uppercase tracking-widest text-xs">
            <Zap className="h-4 w-4 fill-primary" /> System Control Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">ADMIN <span className="text-primary italic">CORE.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Monitor performa infrastruktur dan ekosistem UNSRI Events secara real-time.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
           <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                 <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter">{totalUsers}</CardTitle>
              <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Total Users</CardDescription>
           </CardHeader>
        </Card>
        
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
           <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
                 <CalendarDays className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter">{totalEvents}</CardTitle>
              <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Total Events</CardDescription>
           </CardHeader>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
           <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                 <UserCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter">{totalRegistrations}</CardTitle>
              <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Total Registrations</CardDescription>
           </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black tracking-tight uppercase italic">SYSTEM GROWTH</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Tren pertumbuhan pengguna baru tahun ini.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleAreaChart data={chartData?.growth || []} color="#3b82f6" height={250} />
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden">
          <CardHeader className="pb-8">
             <CardTitle className="text-2xl font-black tracking-tight uppercase italic">CATEGORIES</CardTitle>
             <CardDescription className="text-sm font-medium mt-1">Distribusi kategori acara.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={chartData?.categories || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black tracking-tight uppercase italic">RECENT ADMISSIONS</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Daftar pengguna terbaru yang mendaftar di sistem.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/50 overflow-hidden">
               {recentUsers.map((user: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-secondary border-b border-border/50 last:border-0 hover:bg-muted transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-foreground shadow-lg">
                       {user.name?.[0]}
                     </div>
                     <div>
                       <p className="font-black text-sm tracking-tight">{user.name}</p>
                       <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-wider">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <Badge variant="outline" className={cn(
                     "font-black text-[10px] tracking-widest px-3 py-1 bg-secondary rounded-lg border-2",
                     user.role === "admin" ? "text-primary border-primary/20" : "text-emerald-400 border-emerald-400/20"
                   )}>
                     {user.role?.toUpperCase() || "USER"}
                   </Badge>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Mini */}
        <Card className="bg-background border-border shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <Activity className="h-20 w-20 text-primary" />
           </div>
           <CardHeader>
              <CardTitle className="text-foreground font-black tracking-tight text-xl flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 LIVE CONSOLE
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Real-time infrastructure telemetry.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6 pt-4">
              <div className="space-y-4 font-mono text-[10px] leading-relaxed">
                 <div className="text-emerald-400/80 uppercase">
                    <span className="opacity-50">18:05:12</span> [OK] Server 01 initialized.
                 </div>
                 <div className="text-muted-foreground uppercase">
                    <span className="opacity-50">18:10:45</span> [DB] Connection pool optimized (12ms).
                 </div>
                 <div className="text-muted-foreground uppercase">
                    <span className="opacity-50">18:12:01</span> [MAIL] Email blast queued (842 targets).
                 </div>
                 <div className="text-orange-400 animate-pulse uppercase">
                    <span className="opacity-50">18:15:22</span> [WARN] High memory load detected (88%).
                 </div>
                 <div className="text-muted-foreground uppercase">
                    <span className="opacity-50">18:20:00</span> [SYS] Daily backup chunk #4 completed.
                 </div>
              </div>
              
              <div className="pt-8 grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-secondary border border-border">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">CPU LOAD</p>
                    <p className="text-2xl font-black text-foreground tracking-tighter">24.2<span className="text-sm font-normal opacity-50 ml-1">%</span></p>
                    <div className="h-1 w-full bg-muted rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-primary w-1/4 rounded-full" />
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-secondary border border-border">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">LATENCY</p>
                    <p className="text-2xl font-black text-foreground tracking-tighter">42<span className="text-sm font-normal opacity-50 ml-1">ms</span></p>
                    <div className="h-1 w-full bg-muted rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-emerald-500 w-1/3 rounded-full" />
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
