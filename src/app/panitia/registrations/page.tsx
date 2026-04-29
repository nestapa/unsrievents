import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getPanitiaRegistrations } from "@/lib/actions";
import { RegistrationStatusAction } from "@/components/events/registration-status-action";
import { ExportCSVButton } from "@/components/export-csv-button";

export default async function PanitiaRegistrationsPage() {
  const myRegistrations = await getPanitiaRegistrations();

  const exportColumns = [
    { key: "user.name", label: "Nama Peserta" },
    { key: "user.email", label: "Email" },
    { key: "event.title", label: "Acara" },
    { key: "status", label: "Status" },
    { key: "registeredAt", label: "Tanggal Daftar" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">KELOLA <span className="text-primary italic">PENDAFTARAN.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Terima atau tolak pendaftaran peserta untuk acara Anda.</p>
        </div>
        <div className="flex gap-3">
          <ExportCSVButton data={myRegistrations} filename="Data_Pendaftar_Event" columns={exportColumns} />
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
         <CardContent className="p-0">
           <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 pl-6">Peserta</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Acara</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Tanggal Daftar</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRegistrations.map((reg: any) => (
                    <TableRow key={reg.id} className="group hover:bg-muted/50 transition-colors border-border">
                      <TableCell className="align-middle pl-6 py-4">
                        <span className="font-black text-sm uppercase tracking-tight">{reg.user.name}</span>
                        <br />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{reg.user.email}</span>
                      </TableCell>
                      <TableCell className="align-middle text-xs font-bold text-muted-foreground uppercase tracking-widest">
                         {reg.event.title}
                      </TableCell>
                      <TableCell className="align-middle text-xs font-bold text-muted-foreground uppercase tracking-widest">
                         {new Date(reg.registeredAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="align-middle">
                         <Badge variant="outline" className={cn(
                           "font-black text-[10px] tracking-widest px-2 py-0.5 rounded-md border-2 uppercase",
                           reg.status === "confirmed" ? "text-emerald-400 border-emerald-400/20" : reg.status === "pending" ? "text-amber-400 border-amber-400/20" : "text-destructive border-destructive/20"
                         )}>
                           {reg.status}
                         </Badge>
                      </TableCell>
                      <TableCell className="align-middle text-right pr-6">
                        <RegistrationStatusAction registrationId={reg.id} currentStatus={reg.status} />
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
           </Table>
           {myRegistrations.length === 0 && (
             <div className="py-20 text-center">
               <p className="text-muted-foreground font-bold italic">Belum ada pendaftar.</p>
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );
}
