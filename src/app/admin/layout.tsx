"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { LayoutDashboard, Calendar, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { title: "Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Manajemen Event", href: "/admin/events", icon: Calendar },
    { title: "Semua Pendaftaran", href: "/admin/registrations", icon: Users },
    { title: "Pengguna", href: "/admin/users", icon: Users },
  ];

  return (
    <DashboardShell userRole="admin" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
