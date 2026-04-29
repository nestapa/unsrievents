"use client";

import { Navbar } from "@/components/navbar";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
              <Sparkles className="h-5 w-5" />
              <span className="uppercase tracking-[0.3em] text-xs">Trust & Safety First</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              PRIVACY <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 underline decoration-primary decoration-8 underline-offset-[16px]">POLICY.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium mt-12 max-w-2xl leading-relaxed">
              Terakhir diperbarui: 7 April 2026. Data Anda adalah kuasa Anda. Kami menjaga privasi setiap mahasiswa UNSRI dengan standar keamanan tertinggi.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-zinc max-w-none space-y-16">
            <section className="bg-card/50 p-10 rounded-[2.5rem] border border-border backdrop-blur-xl">
               <h2 className="text-3xl font-black tracking-tight text-foreground mb-6 uppercase flex items-center gap-4">
                 <span className="h-2 w-12 bg-primary rounded-full" />
                 PENGUMPULAN DATA
               </h2>
               <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                 Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar akun atau berpartisipasi dalam acara, termasuk nama, NIM, email institusi, dan riwayat partisipasi acara. Informasi ini digunakan murni untuk keperluan administrasi akademik dan manajemen acara.
               </p>
            </section>

            <section className="bg-card/50 p-10 rounded-[2.5rem] border border-border backdrop-blur-xl">
               <h2 className="text-3xl font-black tracking-tight text-foreground mb-6 uppercase flex items-center gap-4">
                 <span className="h-2 w-12 bg-primary rounded-full" />
                 PENGGUNAAN INFORMASI
               </h2>
               <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                 Data Anda digunakan untuk memproses pendaftaran acara, mengirimkan notifikasi penting terkait jadwal, serta menghasilkan laporan statistik bagi penyelenggara acara (panitia) demi meningkatkan kualitas kegiatan mahasiswa.
               </p>
            </section>

            <section className="bg-card/50 p-10 rounded-[2.5rem] border border-border backdrop-blur-xl transition-all hover:border-primary/20">
               <h2 className="text-3xl font-black tracking-tight text-foreground mb-6 uppercase flex items-center gap-4">
                 <span className="h-2 w-12 bg-primary rounded-full" />
                 KEAMANAN DATA
               </h2>
               <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                 Kami menggunakan enkripsi tingkat lanjut untuk melindungi transfer data dan penyimpanan informasi sensitif Anda. Akses ke data pribadi dibatasi hanya untuk personel yang membutuhkannya untuk menjalankan tugas resmi.
               </p>
            </section>

            <section className="bg-card/50 p-10 rounded-[2.5rem] border border-border backdrop-blur-xl">
               <h2 className="text-3xl font-black tracking-tight text-foreground mb-6 uppercase flex items-center gap-4">
                 <span className="h-2 w-12 bg-primary rounded-full" />
                 HAK PENGGUNA
               </h2>
               <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                 Anda berhak mengakses, memperbarui, atau meminta penghapusan data Anda kapan saja melalui dashboard pengguna atau dengan menghubungi tim administrator platform kami.
               </p>
            </section>
          </div>
          
          <div className="mt-24 pt-20 border-t border-border text-center">
             <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-foreground">Butuh bantuan lebih lanjut?</h3>
             <Button variant="outline" className="border-2 h-16 px-12 rounded-2xl font-black tracking-widest text-xs">
                HUBUNGI TIM PRIVASI
             </Button>
          </div>
        </div>
      </main>

      <footer className="bg-background py-12 border-t border-border">
        <div className="container max-w-6xl mx-auto px-6 text-center">
           <p className="text-muted-foreground font-black text-[10px] tracking-[0.2em] uppercase">
             © 2026 UNSRI Events. Secure & Trusted.
           </p>
        </div>
      </footer>
    </div>
  );
}
