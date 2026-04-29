"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { registerForEvent } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function RegisterButton({ eventId }: { eventId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleRegister = async () => {
        if (!session) {
            toast.error("Please login first to register for events.");
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerForEvent(eventId);
            if (result.success) {
                toast.success("Successfully registered for this event!");
            } else {
                toast.error(result.error || "Failed to register.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleRegister} 
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl tracking-tight shadow-[0_0_50px_-10px_oklch(var(--primary))] hover:shadow-[0_0_80px_-10px_oklch(var(--primary))] transition-all active:scale-95"
        >
            {isLoading ? "PROCESSING..." : "REGISTER NOW"}
        </Button>
    );
}
