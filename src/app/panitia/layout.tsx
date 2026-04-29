"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { LayoutDashboard, FilePlus, Calendar } from "lucide-react";

export default function PanitiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { title: "Beranda", href: "/panitia", icon: LayoutDashboard },
    { title: "Kelola Event", href: "/panitia/events", icon: Calendar },
    { title: "Pendaftaran", href: "/panitia/registrations", icon: FilePlus },
    { title: "Jelajahi Acara", href: "/events", icon: Calendar },
  ];

  return (
    <DashboardShell userRole="panitia" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
