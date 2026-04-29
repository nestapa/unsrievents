"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { LayoutDashboard, Calendar, Ticket, Trophy } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { title: "Overview", href: "/user", icon: LayoutDashboard },
    { title: "Status Pendaftaran", href: "/user/registrations", icon: Ticket },
    { title: "Portofolio", href: "/user/history", icon: Trophy },
    { title: "Jelajahi Acara", href: "/events", icon: Calendar },
  ];

  return (
    <DashboardShell userRole="user" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
