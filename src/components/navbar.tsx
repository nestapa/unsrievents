"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, LayoutDashboard, LogOut, User, Menu, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, isPending } = useSession();
  
  const isLoggedIn = !!session;
  const user = session?.user as any; 
  const role = user?.role || "user"; 


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "EXPLORE", href: "/events" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 px-4 md:px-10",
        isScrolled ? "py-3 md:py-4" : "py-6 md:py-10"
      )}
    >
      <div 
        className={cn(
          "container max-w-6xl mx-auto flex h-16 md:h-20 items-center justify-between rounded-3xl px-6 md:px-10 transition-all duration-500",
          isScrolled 
            ? "bg-card/80 backdrop-blur-2xl border border-border/50 shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-all shadow-[0_0_20px_oklch(var(--primary)/0.4)]">
               <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-black text-xl md:text-3xl tracking-tighter uppercase hidden sm:inline-block">
              UNSRI<span className="text-primary italic">Events</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-black tracking-widest transition-all hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-muted mx-2" />

          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />
          ) : isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href={`/${role}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-black tracking-widest text-xs")}>
                DASHBOARD
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-colors p-0.5 outline-none">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-card/95 backdrop-blur-xl border-border" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-bold p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black leading-none">{user?.name}</p>
                        <p className="text-xs font-medium text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-secondary" />
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <Link href="/profile" className="flex items-center w-full font-bold text-sm">
                        <User className="mr-3 h-4 w-4 text-primary" />
                        <span>PROFIL SAYA</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-secondary" />
                    <DropdownMenuItem 
                      className="p-3 text-destructive focus:text-destructive cursor-pointer font-bold text-sm"
                      onClick={async () => {
                        await signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              window.location.href = "/login";
                            }
                          }
                        });
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>LOGOUT</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs font-black tracking-widest hover:text-primary transition-colors">
                LOGIN
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-black tracking-widest text-xs px-6 rounded-xl shadow-lg shadow-primary/20">
                  JOIN NOW
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
           {isLoggedIn && (
              <Avatar className="h-8 w-8 border border-primary/20">
                 <AvatarImage src={user?.image || ""} />
                 <AvatarFallback className="text-[10px] font-bold">
                    {user?.name?.substring(0, 2).toUpperCase()}
                 </AvatarFallback>
              </Avatar>
           )}
          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-xl bg-secondary hover:bg-muted")}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] bg-card/95 backdrop-blur-2xl border-l-white/10 p-10">
              <div className="flex flex-col gap-8">
                 <div className="mb-4">
                    <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center mb-4">
                       <Sparkles className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase">UNSRI<span className="text-primary italic">Events</span></span>
                 </div>
                
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-2xl font-black tracking-tighter hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                <div className="h-[1px] bg-secondary w-full my-4" />
                
                {isLoggedIn ? (
                  <div className="flex flex-col gap-6">
                    <Link href={`/${role}`} className="text-lg font-black tracking-tight flex items-center gap-3">
                      <LayoutDashboard className="h-5 w-5 text-primary" /> DASHBOARD
                    </Link>
                    <button 
                        onClick={async () => {
                          await signOut({
                            fetchOptions: {
                              onSuccess: () => {
                                window.location.href = "/login";
                              }
                            }
                          });
                        }}
                        className="text-lg font-black tracking-tight text-destructive flex items-center gap-3 text-left w-full"
                    >
                      <LogOut className="h-5 w-5" /> LOGOUT
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg border-2">LOGIN</Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">JOIN NOW</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
