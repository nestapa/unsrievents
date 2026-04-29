"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await signUp.email({
                email,
                password,
                name,
            });
 
            if (error) {
                setError(error.message || "Registration failed. Please check your data.");
                return;
            }

            if (data?.user) {
                const user = data.user as any;
                const role = user.role as string;
                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "panitia") {
                    router.push("/panitia");
                } else {
                    router.push("/user");
                }
            } else {
                router.push("/login?registered=true");
            }
        } catch (err: any) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50rem] h-[50rem] bg-primary/20 rounded-full blur-[150px] opacity-30" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[45rem] h-[45rem] bg-purple-600/10 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
                        <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <CalendarDays className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <span className="font-black text-3xl tracking-tighter uppercase">UNSRI<span className="text-primary italic">Events</span></span>
                    </Link>
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">JOIN THE <br /><span className="text-primary">ELITE.</span></h1>
                    <p className="text-muted-foreground font-medium mt-4">Bersiap untuk pengalaman paling intens di kampus.</p>
                </div>

                <Card className="bg-card backdrop-blur-3xl border-border rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <CardHeader className="pt-10 px-10">
                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Create Account</CardTitle>
                        <CardDescription className="font-bold text-xs uppercase tracking-widest text-primary">Start your legacy today</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-4">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                                <Input 
                                    placeholder="Enter your name" 
                                    className="h-14 bg-secondary border-transparent rounded-2xl focus:border-primary/50 text-base font-bold"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Institutional</label>
                                <Input 
                                    type="email"
                                    placeholder="name@student.unsri.ac.id" 
                                    className="h-14 bg-secondary border-transparent rounded-2xl focus:border-primary/50 text-base font-bold"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                                <Input 
                                    type="password"
                                    placeholder="••••••••" 
                                    className="h-14 bg-secondary border-transparent rounded-2xl focus:border-primary/50 text-base font-bold"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-destructive text-xs font-black uppercase tracking-widest text-center">{error}</p>}

                            <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl text-lg font-black tracking-widest shadow-xl shadow-primary/20 group uppercase">
                                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                    <>SIGN UP <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-muted-foreground font-bold text-sm">
                                Already in? <Link href="/login" className="text-primary hover:underline underline-offset-4 ml-1">LOG IN HERE</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
                
                <p className="text-center text-[10px] font-black text-muted-foreground mt-8 uppercase tracking-[0.3em] opacity-50">
                    © 2026 UNSRI Events. Managed with Power.
                </p>
            </div>
        </div>
    );
}
