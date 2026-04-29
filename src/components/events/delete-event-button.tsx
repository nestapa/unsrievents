"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteEventButtonProps {
  eventId: string;
}

export function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteEvent(eventId);
      if (res.success) {
        toast.success("Event deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete event");
      }
    });
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
