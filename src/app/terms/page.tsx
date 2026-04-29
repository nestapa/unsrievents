"use client";

import { Navbar } from "@/components/navbar";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow pt-40 pb-32">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-20">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-black mb-10 group bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-[0.2em] text-[10px]">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-2 text-primary font-black mb-4">
              <ShieldCheck className="h-5 w-5" />
              <span className="uppercase tracking-[0.3em] text-xs">Agreement & Conduct</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              TERMS OF <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 underline decoration-primary decoration-8 underline-offset-[16px]">SERVICE.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium mt-12 max-w-2xl leading-relaxed">
              Dengan menggunakan platform UNSRI Events, Anda setuju untuk mematuhi aturan main kami demi ekosistem akademik yang sehat dan produktif.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {[
              {
                title: "1. KELAYAKAN PENGGUNA",
                content: "Akses ke platform ini terbatas hanya untuk mahasiswa, staf, dan alumni Universitas Sriwijaya dengan akun SSO atau kredensial resmi yang divalidasi oleh sistem."
              },
              {
                title: "2. KODE ETIK ACARA",
                content: "Peserta wajib menjaga etika selama mengikuti acara, baik daring maupun luring. Segala bentuk pelecehan, intimidasi, atau tindakan yang mengganggu jalannya acara akan berakibat pada pencabutan hak akses."
              },
              {
                title: "3. TANGGUNG JAWAB PANITIA",
                content: "Panitia penyelenggara bertanggung jawab penuh atas konten, kualitas, dan pelaksanaan acara yang mereka publikasikan di platform ini. UNSRI Events hanya bertindak sebagai fasilitator infrastruktur."
              },
              {
                title: "4. PEMBATALAN & REFUND",
                content: "Kebijakan pembatalan dan pengembalian dana (jika ada) ditentukan sepenuhnya oleh penyelenggara masing-masing acara. Pastikan Anda membaca syarat khusus sebelum melakukan pembayaran."
              },
              {
                title: "5. INTELEKTUAL PROPERTI",
                content: "Semua materi yang dibagikan selama acara adalah milik intelektual pembicara atau organisasi penyelenggara, kecuali dinyatakan lain secara tertulis."
              }
            ].map((section, idx) => (
              <section key={idx} className="group flex gap-8">
                 <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center font-black text-2xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    {idx + 1}
                 </div>
                 <div className="space-y-4 pt-2">
                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">{section.title}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium max-w-2xl group-hover:text-zinc-300 transition-colors">
                      {section.content}
                    </p>
                 </div>
              </section>
            ))}
          </div>
          
          <div className="mt-24 pt-20 border-t border-border bg-gradient-to-b from-primary/5 to-transparent p-12 rounded-[3rem]">
             <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-foreground">Sudah paham aturannya?</h3>
             <p className="text-muted-foreground font-medium mb-10 max-w-md mx-auto text-center">
                Mulai jelajahi acara sekarang atau buat acaramu sendiri sebagai panitia.
             </p>
             <div className="flex justify-center gap-6">
                <Link href="/events">
                   <Button className="h-16 px-10 rounded-2xl font-black tracking-widest text-xs shadow-xl shadow-primary/20">
                      MULAI JELAJAHI
                   </Button>
                </Link>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-background py-12 border-t border-border">
        <div className="container max-w-6xl mx-auto px-6 text-center">
           <p className="text-muted-foreground font-black text-[10px] tracking-[0.2em] uppercase">
             © 2026 UNSRI Events. Rules of the Game.
           </p>
        </div>
      </footer>
    </div>
  );
}
