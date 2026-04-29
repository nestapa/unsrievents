"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import { updateRegistrationStatus, deleteRegistration } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function RegistrationStatusAction({ registrationId, currentStatus }: { registrationId: string, currentStatus: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (status: "confirmed" | "cancelled") => {
    setIsPending(true);
    try {
      const res = await updateRegistrationStatus(registrationId, status);
      if (res.success) {
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (e) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const res = await deleteRegistration(registrationId);
      if (res.success) {
        toast.success("Pendaftar berhasil dihapus");
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (e) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <>
          {currentStatus !== "confirmed" && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleUpdate("confirmed")} 
              disabled={isPending}
              className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all text-muted-foreground"
              title="Konfirmasi"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          {currentStatus !== "cancelled" && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleUpdate("cancelled")} 
              disabled={isPending}
              className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20 transition-all text-muted-foreground"
              title="Tolak"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger 
              render={
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={isPending}
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all text-muted-foreground"
                  title="Hapus Permanen"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black uppercase tracking-tight">Hapus Pendaftar?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan. Pendaftar ini akan dihapus secara permanen dari sistem dan kuota acara akan dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-black uppercase text-xs">Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-black uppercase text-xs">
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
