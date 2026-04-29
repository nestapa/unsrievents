"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  History, 
  FilePlus, 
  Bell,
  Search,
  User,
  Menu
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useSession, signOut } from "@/lib/auth-client";

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "panitia" | "user";
  navItems: NavItem[];
}

export function DashboardShell({ children, userRole, navItems }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userData = session?.user as any;

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50rem] h-[50rem] bg-primary/10 rounded-full blur-[150px] opacity-30" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[45rem] h-[45rem] bg-purple-600/10 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } relative hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-2xl transition-all duration-300 ease-in-out z-30`}
      >
        <div className={`flex h-20 items-center border-b border-border px-6 ${isSidebarOpen ? "" : "px-0 justify-center"}`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform flex-shrink-0 shadow-lg shadow-primary/20">
               <Calendar className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter truncate uppercase">UNSRI<span className="text-primary italic">Events</span></span>}
          </Link>
        </div>

        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full ${isSidebarOpen ? "justify-start px-4" : "justify-center px-0"} gap-3 h-14 rounded-xl ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-black tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground border-none" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary font-bold tracking-widest border-transparent"
                  } uppercase transition-all`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  {isSidebarOpen && <span className="text-xs">{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            onClick={async () => {
                      await signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            window.location.href = "/login";
                          }
                        }
                      });
                    }}
            className={`w-full ${isSidebarOpen ? "justify-start px-4" : "justify-center px-0"} gap-3 h-14 text-destructive hover:text-destructive hover:bg-destructive/10 font-black tracking-widest rounded-xl uppercase text-xs transition-all`}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Keluar</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-sm hidden md:flex items-center justify-center p-0 hover:bg-muted transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-2xl sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-grow max-w-md">
            {/* Mobile Sidebar Toggle */}
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden text-muted-foreground")}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card/95 backdrop-blur-3xl border-r-border p-0 flex flex-col">
                <div className="flex h-20 items-center border-b border-border px-6">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform flex-shrink-0 shadow-lg shadow-primary/20">
                       <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter truncate uppercase">UNSRI<span className="text-primary italic">Events</span></span>
                  </Link>
                </div>
                <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} className="block">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 h-14 px-4 rounded-xl ${
                            isActive 
                              ? "bg-primary text-primary-foreground font-black tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground border-none" 
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary font-bold tracking-widest border-transparent"
                          } uppercase transition-all mb-2`}
                        >
                          <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                          <span className="text-xs">{item.title}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-border space-y-2 mt-auto">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            window.location.href = "/login";
                          }
                        }
                      });
                    }}
                    className="w-full justify-start gap-3 h-14 px-4 text-destructive hover:text-destructive hover:bg-destructive/10 font-black tracking-widest rounded-xl uppercase text-xs transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Keluar</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="relative w-full group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Cari sesuatu..." 
                className="pl-10 bg-secondary border-transparent group-focus-within:bg-muted group-focus-within:border-primary/50 transition-all rounded-2xl h-12 text-sm font-bold placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "pl-1 pr-3 h-12 gap-3 rounded-full hover:bg-muted focus-visible:ring-0 border-none transition-all")}>
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={userData?.image || ""} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {userData?.name?.substring(0, 2).toUpperCase() || "UN"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start leading-none gap-1 text-left">
                  <span className="text-sm font-black tracking-tight truncate max-w-[120px] uppercase">{userData?.name || "Loading..."}</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-2 h-4 font-black tracking-widest bg-primary/10 border-primary/20 text-primary uppercase">
                    {userRole}
                  </Badge>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-card/95 backdrop-blur-xl border-border" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-bold p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none">{userData?.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">{userData?.email}</p>
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
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
