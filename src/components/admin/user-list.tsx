"use client";

import { useState, useTransition } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Shield, User, Trash2, Loader2, Check } from "lucide-react";
import { adminUpdateUserRole, adminDeleteUser } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: any[];
}

export function UserList({ users: initialUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  async function handleUpdateRole(userId: string, role: "admin" | "panitia" | "user") {
    startTransition(async () => {
      const res = await adminUpdateUserRole(userId, role);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
        toast.success(`Role updated to ${role}`);
      } else {
        toast.error(res.error || "Failed to update role");
      }
    });
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    startTransition(async () => {
      const res = await adminDeleteUser(userId);
      if (res.success) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success("User deleted");
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    });
  }

  return (
    <div className="relative rounded-2xl border border-border/50 overflow-hidden bg-card/40 backdrop-blur-xl">
      {isPending && (
        <div className="absolute inset-0 z-50 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-card p-4 rounded-2xl border border-border shadow-2xl flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="font-black text-xs tracking-widest uppercase">Processing...</span>
            </div>
        </div>
      )}
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="w-[250px] font-black text-[10px] uppercase tracking-widest">User Information</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status/Role</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest">Joined Date</TableHead>
            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} className="group hover:bg-muted transition-colors border-border">
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-white shadow-lg shrink-0">
                    {u.name?.[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-sm tracking-tight truncate uppercase">{u.name}</span>
                    <span className="text-[10px] text-muted-foreground font-medium truncate italic">{u.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-black text-[9px] tracking-widest uppercase px-3 py-1 bg-secondary rounded-lg border-2",
                    u.role === "admin" ? "text-primary border-primary/20" : 
                    u.role === "panitia" ? "text-emerald-400 border-emerald-400/20" : 
                    "text-muted-foreground border-border/50"
                  )}
                >
                  {u.role?.toUpperCase() || "USER"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border rounded-xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest p-3">Manage Access</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-secondary" />
                    <DropdownMenuGroup className="p-1">
                        <DropdownMenuItem onClick={() => handleUpdateRole(u.id, "admin")} className="p-3 cursor-pointer font-bold text-xs gap-3 rounded-lg">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <span>Make Admin</span>
                            {u.role === "admin" && <Check className="h-4 w-4 ml-auto text-primary" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(u.id, "panitia")} className="p-3 cursor-pointer font-bold text-xs gap-3 rounded-lg">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-emerald-400" />
                            </div>
                            <span>Make Panitia</span>
                            {u.role === "panitia" && <Check className="h-4 w-4 ml-auto text-emerald-400" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(u.id, "user")} className="p-3 cursor-pointer font-bold text-xs gap-3 rounded-lg">
                            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span>Make User</span>
                            {u.role === "user" && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-secondary" />
                    <div className="p-1">
                        <DropdownMenuItem onClick={() => handleDeleteUser(u.id)} className="p-3 cursor-pointer font-bold text-xs gap-3 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10">
                            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                <Trash2 className="h-4 w-4" />
                            </div>
                            <span>Delete User Account</span>
                        </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-black uppercase tracking-widest italic text-xs">No users found in system.</p>
        </div>
      )}
    </div>
  );
}
