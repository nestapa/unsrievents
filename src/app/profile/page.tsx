import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, CalendarDays } from "lucide-react";

export default async function ProfilePage() {
    const sessionData = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (!sessionData) {
        redirect("/login");
    }

    const { user } = sessionData as any;

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50rem] h-[50rem] bg-primary/20 rounded-full blur-[150px] opacity-30" />
                <div className="absolute top-[40%] right-[0%] w-[45rem] h-[45rem] bg-purple-600/10 rounded-full blur-[120px] opacity-20" />
            </div>

            <Navbar />
            
            <main className="flex-grow pt-32 px-6">
                <div className="container max-w-3xl mx-auto">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                            profil <br /><span className="text-primary italic">saya.</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-4 uppercase tracking-widest text-xs">
                            Kelola Identitas Acara Anda
                        </p>
                    </div>

                    <Card className="bg-card backdrop-blur-3xl border-border rounded-[2rem] shadow-2xl overflow-hidden pt-6">
                        <CardHeader className="text-center md:text-left flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-primary/10">
                            <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-[0_0_30px_oklch(var(--primary)/0.3)]">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center md:items-start gap-2">
                                <CardTitle className="text-3xl font-black tracking-tighter uppercase">{user.name}</CardTitle>
                                <CardDescription className="font-bold text-sm text-muted-foreground">
                                    Identitas akun pengguna UNSRI Events
                                </CardDescription>
                                <Badge className="mt-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 uppercase tracking-widest text-[10px] font-black px-4 py-1">
                                    {user.role}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 bg-secondary p-6 rounded-2xl border border-border">
                                    <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-[0.2em]">
                                        <Mail className="h-4 w-4" /> Alamat Email
                                    </div>
                                    <p className="font-bold text-lg">{user.email}</p>
                                </div>
                                <div className="space-y-3 bg-secondary p-6 rounded-2xl border border-border">
                                    <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-[0.2em]">
                                        <Shield className="h-4 w-4" /> Status Akun
                                    </div>
                                    <p className="font-bold text-lg text-emerald-400">Aktif & Terverifikasi</p>
                                </div>
                                <div className="space-y-3 bg-secondary p-6 rounded-2xl border border-border md:col-span-2">
                                    <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-[0.2em]">
                                        <CalendarDays className="h-4 w-4" /> Tanggal Bergabung
                                    </div>
                                    <p className="font-bold text-lg">
                                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
