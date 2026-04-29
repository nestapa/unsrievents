import { EventForm } from "@/components/events/event-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-[10px] font-black uppercase tracking-[0.2em]">
            <BreadcrumbItem>
              <BreadcrumbLink 
                render={(props) => <Link {...props} href="/panitia" />}
              >
                DASHBOARD
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">CREATE NEW EVENT</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">LAUNCH <span className="text-primary italic">EVENT.</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-tight text-xs bg-secondary w-fit px-3 py-1 rounded-md">Create a new engagement platform for the community.</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <EventForm />
      </div>
    </div>
  );
}
