import { getEventById } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Users, Share2, Info, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RegisterButton } from "@/app/events/[id]/register-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const eventData = await getEventById(id);

    if (!eventData) {
        notFound();
    }

    const sessionData = await auth.api.getSession({
        headers: await headers(),
    });
    const session = sessionData as any;

    let isRegistered = false;
    if (session) {
        const registration = await db.query.registrations.findFirst({
            where: and(
                eq(registrations.eventId, id),
                eq(registrations.userId, session.user.id)
            )
        });
        isRegistered = !!registration;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <Navbar />

            <main className="flex-grow pt-32">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left Column: Image & Details */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border shadow-2xl group">
                                <Image
                                    src={eventData.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop"}
                                    alt={eventData.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <div className="px-4 py-1.5 bg-primary rounded-full text-primary-foreground font-black text-[10px] tracking-[0.2em] uppercase">
                                            {eventData.category}
                                        </div>
                                        <div className="px-4 py-1.5 bg-muted backdrop-blur-md rounded-full text-foreground font-black text-[10px] tracking-[0.2em] uppercase border border-border">
                                            {eventData.status}
                                        </div>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter text-foreground uppercase leading-[0.9]">
                                        {eventData.title}
                                    </h1>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs">
                                    <Info className="h-4 w-4" /> Description
                                </div>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                                    {eventData.description || "Tidak ada deskripsi tersedia untuk acara ini."}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Information Card */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 space-y-6">
                                <div className="bg-secondary/40 backdrop-blur-2xl border border-border rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <ShieldCheck className="h-24 w-24 text-primary" />
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Price</p>
                                            <p className="text-5xl font-black text-primary tracking-tighter">{eventData.price === "0" || eventData.price === "Gratis" ? "FREE" : eventData.price}</p>
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-border">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                                    <CalendarDays className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</p>
                                                    <p className="font-bold">{new Date(eventData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                                                    <p className="font-bold">{eventData.location}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Availability</p>
                                                    <p className="font-bold text-emerald-400">{eventData.remainingSeats} Seats Left / {eventData.seats} Total</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            {isRegistered ? (
                                                <Button disabled className="w-full h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black text-lg tracking-tight">
                                                    ALREADY REGISTERED
                                                </Button>
                                            ) : eventData.remainingSeats <= 0 ? (
                                                <Button disabled className="w-full h-16 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-lg tracking-tight">
                                                    FULLY BOOKED
                                                </Button>
                                            ) : (
                                                <RegisterButton eventId={eventData.id} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-[10px] text-foreground">
                                            {(eventData as any).organizer?.name?.[0] || "O"}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Organized by</p>
                                            <p className="text-xs font-black uppercase tracking-tight">{(eventData as any).organizer?.name || "Organizer"}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
