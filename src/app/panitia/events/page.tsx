import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { getPanitiaEvents } from "@/lib/actions";
import { ExportCSVButton } from "@/components/export-csv-button";

export default async function PanitiaEventsPage() {
  const myEvents = await getPanitiaEvents();

  const exportColumns = [
    { key: "title", label: "Nama Acara" },
    { key: "category", label: "Kategori" },
    { key: "date", label: "Tanggal" },
    { key: "location", label: "Lokasi" },
    { key: "price", label: "Harga" },
    { key: "seats", label: "Kapasitas Total" },
    { key: "remainingSeats", label: "Kursi Tersisa" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">KELOLA <span className="text-primary italic">EVENT.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Daftar acara yang Anda kelola. Edit atau hapus acara.</p>
        </div>
        <div className="flex gap-3">
           <ExportCSVButton data={myEvents} filename="Data_Acara" columns={exportColumns} />
           <Link href="/panitia/events/new">
             <Button className="h-12 px-6 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
               <Plus className="h-5 w-5" /> BUAT ACARA
             </Button>
           </Link>
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-border/50 overflow-hidden shadow-xl">
         <CardContent className="p-0">
           <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 pl-6">Nama Acara</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Kategori</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Tanggal</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Kapasitas</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myEvents.map((event: any) => {
                  const participants = event.seats - event.remainingSeats;
                  return (
                    <TableRow key={event.id} className="group hover:bg-muted/50 transition-colors border-border">
                      <TableCell className="align-middle pl-6 py-4">
                        <span className="font-black text-sm uppercase tracking-tight">{event.title}</span>
                      </TableCell>
                      <TableCell className="align-middle">
                         <Badge variant="outline" className="font-black text-[10px] tracking-widest text-primary border-primary/20 uppercase">{event.category}</Badge>
                      </TableCell>
                      <TableCell className="align-middle text-xs font-bold text-muted-foreground uppercase tracking-widest">
                         {new Date(event.date!).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="align-middle">
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{participants} / {event.seats}</span>
                      </TableCell>
                      <TableCell className="align-middle text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                           <Link href={`/panitia/events/${event.id}/edit`}>
                             <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground">
                               <Edit className="h-4 w-4" />
                             </Button>
                           </Link>
                           <DeleteEventButton eventId={event.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
           </Table>
           {myEvents.length === 0 && (
             <div className="py-20 text-center">
               <p className="text-muted-foreground font-bold italic">Belum ada acara yang dibuat.</p>
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );
}
