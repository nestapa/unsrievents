import { getAdminRegistrations } from "@/lib/actions";
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
import { ExportCSVButton } from "@/components/export-csv-button";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default async function AdminRegistrationsPage() {
  const allRegistrations = await getAdminRegistrations();

  const exportColumns = [
    { key: "user.name", label: "Nama Peserta" },
    { key: "user.email", label: "Email" },
    { key: "event.title", label: "Acara" },
    { key: "event.organizer.name", label: "Penyelenggara" },
    { key: "status", label: "Status" },
    { key: "registeredAt", label: "Tanggal Daftar" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">SEMUA <span className="text-primary italic">PENDAFTARAN.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Pantau seluruh pendaftaran peserta lintas acara secara global.</p>
        </div>
        <div className="flex gap-3">
          <ExportCSVButton data={allRegistrations} filename="Semua_Pendaftar_Sistem" columns={exportColumns} />
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
         <CardContent className="p-0">
           <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 pl-6">Peserta</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Acara & Penyelenggara</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Tanggal Daftar</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRegistrations.map((reg: any) => (
                    <TableRow key={reg.id} className="group hover:bg-muted/50 transition-colors border-border">
                      <TableCell className="align-middle pl-6 py-4">
                        <span className="font-black text-sm uppercase tracking-tight">{reg.user.name}</span>
                        <br />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{reg.user.email}</span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                         <span className="text-xs font-bold uppercase tracking-widest text-foreground">{reg.event.title}</span>
                         <br />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">By {reg.event.organizer?.name || "N/A"}</span>
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
                         <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground" title="Hapus Pendaftar (Admin Override)">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
           </Table>
           {allRegistrations.length === 0 && (
             <div className="py-20 text-center">
               <p className="text-muted-foreground font-bold italic">Belum ada pendaftar di sistem.</p>
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );
}
