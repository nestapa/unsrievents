import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, ArrowRight, Sparkles, Trophy, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedEvents } from "@/lib/actions";

export default async function LandingPage() {
  const displayEvents = await getFeaturedEvents();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
          <div className="container max-w-6xl relative z-10 mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-[10px] md:text-sm font-black tracking-[0.2em] uppercase">The Future of Events at UNSRI</span>
              </div>
              
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-8 md:mb-12 leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                UNTAMED <br />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">ENERGY.</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 md:mb-20 max-w-2xl mx-auto leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                Dobrak batas. Temukan pengalaman akademik dan non-akademik paling intens di Universitas Sriwijaya.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                <Link href="/events" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-16 text-xl font-black rounded-2xl shadow-[0_0_50px_-10px_oklch(var(--primary))] hover:shadow-[0_0_80px_-10px_oklch(var(--primary))] transition-all active:scale-95 group">
                    EXPLORE <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-16 text-xl font-black rounded-2xl border-2 hover:bg-secondary transition-all">
                    GET STARTED
                    </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[60rem] h-[60rem] bg-primary/30 rounded-full blur-[180px] animate-pulse opacity-40" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[55rem] h-[55rem] bg-purple-600/20 rounded-full blur-[150px] animate-blob animation-delay-4000 opacity-30" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>
        </section>

        {/* Featured Events */}
        {displayEvents.length > 0 && (
          <section className="py-24 md:py-40">
            <div className="container max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 md:mb-24 px-2">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-primary font-black mb-4">
                    <div className="h-1 w-8 bg-primary rounded-full" />
                    <span className="uppercase tracking-[0.3em] text-[10px] md:text-xs">Curated Hotlinks</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                    THE MAIN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">LINEUP.</span>
                  </h2>
                </div>
                <Link href="/events" className="w-full md:w-auto">
                  <Button variant="outline" className="w-full group text-xs font-black tracking-[0.25em] gap-3 px-8 h-12 rounded-xl border-2">
                    BROWSE ALL EVENTS <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {displayEvents.map((event) => (
                  <Card key={event.id} className="group relative bg-card/50 backdrop-blur-2xl border-border overflow-hidden hover:border-primary/50 transition-all duration-700 hover:translate-y-[-8px]">
                    <div className="relative h-72 md:h-80 overflow-hidden">
                      <Image 
                        src={event.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop"} 
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <Badge className="bg-primary text-primary-foreground font-black px-3 py-1 rounded-md text-[10px] tracking-widest uppercase">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="relative -mt-16 pt-0 px-6">
                      <div className="bg-card/90 backdrop-blur-md p-6 rounded-2xl border border-border shadow-2xl group-hover:border-primary/40 transition-all">
                        <CardTitle className="text-xl md:text-2xl font-black tracking-tight mb-2 line-clamp-2 leading-tight uppercase">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 font-black text-[10px] text-primary tracking-[0.2em] uppercase">
                          UNSRI EVENT
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-8 pb-10 space-y-6 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                          <p className="text-xs font-bold flex items-center gap-2 tracking-tight">
                            <CalendarDays className="h-3 w-3 text-primary" /> {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Soon'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Pricing</p>
                          <p className="text-lg font-black text-primary tracking-tighter">{event.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <div className="flex items-center gap-2 font-black text-[10px] tracking-widest">
                          <Users className="h-4 w-4 text-primary" />
                          {event.seats} CAPACITY
                        </div>
                        <Link href={`/events/${event.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-0 hover:bg-transparent font-black text-[10px] tracking-[0.2em] text-primary group-hover:translate-x-1 transition-transform">
                              DETAILS →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Experience Section */}
        <section className="py-24 md:py-48 bg-secondary/40 relative border-y border-border">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
                  UNLEASH <br />
                  <span className="text-primary italic">POTENTIAL.</span>
                </h2>
                <div className="space-y-12 mt-16 px-2">
                   {[
                     { 
                       title: "INSTANT ACCESS", 
                       desc: "No more long queues. Register in seconds with your student ID.",
                       icon: Sparkles 
                     },
                     { 
                       title: "DIGITAL LEGACY", 
                       desc: "All your achievements, stored in a permanent digital vault.",
                       icon: Trophy 
                     },
                     { 
                       title: "HYPER NETWORK", 
                       desc: "Connect with industry leaders and brilliant peers effortlessly.",
                       icon: Activity 
                     }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-8 group">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-xl">
                           <item.icon className="h-7 w-7 text-primary" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-xl md:text-2xl font-black tracking-tight">{item.title}</h3>
                           <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-[0_0_80px_-20px_oklch(var(--primary)/0.4)] relative z-10 border border-border translate-y-4 md:translate-y-0">
                   <Image 
                     src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
                     alt="Campus Life"
                     fill
                     sizes="(max-width: 1200px) 100vw, 50vw"
                     className="object-cover"
                   />
                </div>
                <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 h-24 w-24 md:h-32 md:w-32 bg-primary rounded-3xl flex flex-col items-center justify-center z-20 rotate-12 shadow-2xl animate-float">
                   <span className="text-2xl md:text-4xl font-black text-primary-foreground">10K</span>
                   <span className="text-[8px] md:text-[10px] font-black text-primary-foreground uppercase tracking-widest text-center px-2">Total Students</span>
                </div>
                <div className="absolute -bottom-10 -left-10 w-full h-full bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 md:py-64 bg-background text-foreground relative overflow-hidden text-center">
          <div className="container max-w-6xl mx-auto px-6 relative z-10">
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8] uppercase">
              WORK <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">WITH US.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto font-bold px-4">
              Kami mencari visioner yang ingin mengubah wajah kegiatan kemahasiswaan di UNSRI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center px-10">
              <Link href="/register">
                <Button size="lg" className="h-16 md:h-20 px-12 md:px-20 text-xl font-black rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xl flex gap-3 items-center group">
                    REGISTER PANITIA <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>
      </main>

      <footer className="bg-background py-24 border-t border-border">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
            <div className="max-w-sm">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                   <CalendarDays className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="font-black text-3xl tracking-tighter uppercase">UNSRI<span className="text-primary italic">Events</span></span>
              </Link>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Empowering students through innovation, technology, and endless opportunities.
              </p>
            </div>
            <div className="flex gap-12">
               <div>
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-foreground">Platform</h4>
                  <ul className="space-y-4 text-muted-foreground font-bold">
                    <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
                    <li><Link href="/register" className="hover:text-primary transition-colors">Join Us</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-foreground">Legal</h4>
                  <ul className="space-y-4 text-muted-foreground font-bold">
                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground font-black text-[10px] tracking-[0.2em] uppercase">
            <p>© 2026 UNSRI Events. Managed with Passion.</p>
            <div className="flex gap-10">
              <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-foreground transition-colors">X / Twitter</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
