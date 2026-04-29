"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent, updateEvent } from "@/lib/actions";
import { toast } from "sonner";
import { Calendar, MapPin, Users, DollarSign, Tag, Image as ImageIcon, Loader2 } from "lucide-react";

interface EventFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function EventForm({ initialData, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const res = isEditing 
        ? await updateEvent(initialData.id, formData)
        : await createEvent(formData);

      if (res.success) {
        toast.success(isEditing ? "Event updated!" : "Event created!");
        router.push(isEditing ? `/events/${initialData.id}` : "/panitia");
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border pb-8">
        <CardTitle className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
          {isEditing ? "Edit Event" : "Create New Event"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Tag className="h-3 w-3" /> Event Title
              </Label>
              <Input 
                name="title" 
                defaultValue={initialData?.title} 
                required 
                placeholder="e.g. Workshop UI/UX Design"
                className="h-12 border-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Tag className="h-3 w-3" /> Category
              </Label>
              <Input 
                name="category" 
                defaultValue={initialData?.category} 
                required 
                placeholder="e.g. Technology, Art, Sports"
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Date
              </Label>
              <Input 
                name="date" 
                type="datetime-local" 
                defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : ""} 
                required 
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Location
              </Label>
              <Input 
                name="location" 
                defaultValue={initialData?.location} 
                required 
                placeholder="e.g. Aula Gedung A, UNSRI"
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="h-3 w-3" /> Total Seats
              </Label>
              <Input 
                name="seats" 
                type="number" 
                defaultValue={initialData?.seats} 
                required 
                placeholder="e.g. 100"
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Price
              </Label>
              <Input 
                name="price" 
                defaultValue={initialData?.price} 
                placeholder="e.g. Gratis or Rp 50.000"
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Event Image
              </Label>
              <Input 
                type="file"
                name="image" 
                accept="image/*"
                className="h-12 border-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer pt-2"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea 
                name="description" 
                defaultValue={initialData?.description} 
                required 
                placeholder="Tell us about the event..."
                className="min-h-[150px] border-2"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex-grow h-14 rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-primary/20"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Event"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="h-14 px-8 rounded-xl font-black uppercase text-sm tracking-widest border-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
