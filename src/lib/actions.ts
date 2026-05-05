"use server";

import { db } from "@/db";
import { events, registrations, user } from "@/db/schema";
import { desc, eq, and, count, sql } from "drizzle-orm";
import { auth } from "./auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getFeaturedEvents() {
    try {
        const featured = await db.query.events.findMany({
            where: eq(events.status, "published"),
            limit: 3,
            orderBy: [desc(events.createdAt)],
            with: {
                organizer: true
            }
        });
        return featured;
    } catch (error) {
        console.error("Error fetching featured events:", error);
        return [];
    }
}

export async function getAllEvents() {
    try {
        const all = await db.query.events.findMany({
            where: eq(events.status, "published"),
            orderBy: [desc(events.date)],
            with: {
                organizer: true
            }
        });
        return all;
    } catch (error) {
        console.error("Error fetching all events:", error);
        return [];
    }
}

export async function getEventById(id: string) {
    try {
        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
            with: {
                organizer: true
            }
        });
        return event;
    } catch (error) {
        console.error("Error fetching event by id:", error);
        return null;
    }
}

export async function registerForEvent(eventId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "You must be logged in to register." };
    }

    try {
        // Check if already registered
        const existing = await db.query.registrations.findFirst({
            where: and(
                eq(registrations.eventId, eventId),
                eq(registrations.userId, session.user.id)
            )
        });

        if (existing) {
            return { error: "Already registered for this event." };
        }

        // Check availability
        const event = await db.query.events.findFirst({
            where: eq(events.id, eventId)
        });

        if (!event || event.remainingSeats <= 0) {
            return { error: "Event is full or does not exist." };
        }

        // Create registration and decrement seats
        await db.transaction(async (tx: any) => {
            await tx.insert(registrations).values({
                id: crypto.randomUUID(),
                userId: session.user.id,
                eventId: eventId,
                status: "pending"
            });

            await tx.update(events)
                .set({ remainingSeats: event.remainingSeats - 1 })
                .where(eq(events.id, eventId));
        });

        revalidatePath(`/events/${eventId}`);
        revalidatePath("/user/events");
        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Failed to register. Please try again." };
    }
}

export async function getPanitiaEvents() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return [];
    }

    try {
        return await db.query.events.findMany({
            where: eq(events.organizerId, session.user.id),
            orderBy: [desc(events.createdAt)]
        });
    } catch (error) {
        console.error("Error fetching panitia events:", error);
        return [];
    }
}

export async function getAdminStats() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return null;
    }

    try {
        const [userCount] = await db.select({ value: count() }).from(user);
        const [eventCount] = await db.select({ value: count() }).from(events);
        const [panitiaCount] = await db.select({ value: count() }).from(user).where(eq(user.role, "panitia"));
        const [registrationCount] = await db.select({ value: count() }).from(registrations);

        const recentUsers = await db.query.user.findMany({
            limit: 5,
            orderBy: [desc(user.createdAt)]
        });

        return {
            totalUsers: userCount.value,
            totalEvents: eventCount.value,
            totalPanitia: panitiaCount.value,
            totalRegistrations: registrationCount.value,
            recentUsers
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return null;
    }
}

export async function adminGetAllUsers() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return [];
    }

    try {
        return await db.query.user.findMany({
            orderBy: [desc(user.createdAt)],
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
}

export async function adminUpdateUserRole(userId: string, role: "admin" | "panitia" | "user") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(user).set({ role }).where(eq(user.id, userId));
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { error: "Failed to update role." };
    }
}

export async function adminDeleteUser(userId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return { error: "Unauthorized" };
    }

    try {
        await db.delete(user).where(eq(user.id, userId));
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { error: "Failed to delete user." };
    }
}

import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function handleImageUpload(image: any): Promise<string | null> {
    if (!image || typeof image === "string" || image.size === 0) return null;
    try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        
        return `/uploads/${filename}`;
    } catch (e) {
        console.error("Failed to upload image", e);
        return null;
    }
}

export async function createEvent(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return { error: "Unauthorized" };
    }

    try {
        const imageFile = formData.get("image");
        const imagePath = await handleImageUpload(imageFile);

        const id = crypto.randomUUID();
        await db.insert(events).values({
            id,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            date: new Date(formData.get("date") as string),
            location: formData.get("location") as string,
            image: imagePath,
            price: (formData.get("price") as string) || "Gratis",
            seats: parseInt(formData.get("seats") as string),
            remainingSeats: parseInt(formData.get("seats") as string),
            organizerId: session.user.id,
            status: "published",
        });

        revalidatePath("/events");
        revalidatePath("/panitia");
        revalidatePath("/admin");
        return { success: true, id };
    } catch (error) {
        console.error("Error creating event:", error);
        return { error: "Failed to create event." };
    }
}

export async function updateEvent(id: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return { error: "Unauthorized" };
    }

    try {
        // Ownership check
        if (session.user.role === "panitia") {
            const existing = await db.query.events.findFirst({
                where: and(eq(events.id, id), eq(events.organizerId, session.user.id))
            });
            if (!existing) return { error: "Not found or unauthorized." };
        }

        const updates: any = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            date: new Date(formData.get("date") as string),
            location: formData.get("location") as string,
            price: formData.get("price") as string,
            seats: parseInt(formData.get("seats") as string),
        };

        const imageFile = formData.get("image");
        const imagePath = await handleImageUpload(imageFile);
        if (imagePath) {
            updates.image = imagePath;
        }

        await db.update(events).set(updates).where(eq(events.id, id));

        revalidatePath(`/events/${id}`);
        revalidatePath("/panitia");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error updating event:", error);
        return { error: "Failed to update event." };
    }
}

export async function deleteEvent(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return { error: "Unauthorized" };
    }

    try {
        // Ownership check
        if (session.user.role === "panitia") {
            const existing = await db.query.events.findFirst({
                where: and(eq(events.id, id), eq(events.organizerId, session.user.id))
            });
            if (!existing) return { error: "Not found or unauthorized." };
        }

        await db.delete(events).where(eq(events.id, id));
        revalidatePath("/events");
        revalidatePath("/panitia");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { error: "Failed to delete event." };
    }
}

export async function getUserRegistrations() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    try {
        return await db.query.registrations.findMany({
            where: eq(registrations.userId, session.user.id),
            with: {
                event: {
                    with: {
                        organizer: true
                    }
                }
            },
            orderBy: [desc(registrations.registeredAt)]
        });
    } catch (error) {
        console.error("Error fetching user registrations:", error);
        return [];
    }
}

import { inArray } from "drizzle-orm";

export async function getPanitiaRegistrations() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return [];
    }

    try {
        const panitiaEvents = await db.query.events.findMany({
            where: eq(events.organizerId, session.user.id),
            columns: { id: true },
        });
        
        if (panitiaEvents.length === 0) return [];
        
        const eventIds = panitiaEvents.map(e => e.id);
        
        return await db.query.registrations.findMany({
            where: inArray(registrations.eventId, eventIds),
            with: {
                user: true,
                event: true
            },
            orderBy: [desc(registrations.registeredAt)]
        });
    } catch (error) {
        console.error("Error fetching panitia registrations:", error);
        return [];
    }
}

export async function updateRegistrationStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return { error: "Unauthorized" };
    }

    try {
        const registration = await db.query.registrations.findFirst({
            where: eq(registrations.id, id),
            with: { event: true }
        });
        
        if (!registration || (session.user.role === "panitia" && registration.event.organizerId !== session.user.id)) {
            return { error: "Not found or unauthorized." };
        }
        
        // Handle seat changes
        const currentStatus = registration.status;
        const eventId = registration.eventId;
        
        await db.transaction(async (tx: any) => {
            await tx.update(registrations).set({ status }).where(eq(registrations.id, id));
            
            if (currentStatus !== "cancelled" && status === "cancelled") {
                // Free up a seat
                await tx.update(events)
                    .set({ remainingSeats: registration.event.remainingSeats + 1 })
                    .where(eq(events.id, eventId));
            } else if (currentStatus === "cancelled" && status === "confirmed") {
                // Consume a seat
                if (registration.event.remainingSeats > 0) {
                    await tx.update(events)
                        .set({ remainingSeats: registration.event.remainingSeats - 1 })
                        .where(eq(events.id, eventId));
                } else {
                    throw new Error("No seats available to confirm this registration.");
                }
            }
        });

        revalidatePath("/panitia");
        revalidatePath("/panitia/registrations");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating registration status:", error);
        return { error: error.message || "Failed to update status." };
    }
}

export async function deleteRegistration(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return { error: "Unauthorized" };
    }

    try {
        const registration = await db.query.registrations.findFirst({
            where: eq(registrations.id, id),
            with: { event: true }
        });
        
        if (!registration || (session.user.role === "panitia" && registration.event.organizerId !== session.user.id)) {
            return { error: "Not found or unauthorized." };
        }
        
        const currentStatus = registration.status;
        const eventId = registration.eventId;
        
        await db.transaction(async (tx: any) => {
            if (currentStatus !== "cancelled") {
                // Free up a seat before deleting
                await tx.update(events)
                    .set({ remainingSeats: registration.event.remainingSeats + 1 })
                    .where(eq(events.id, eventId));
            }
            await tx.delete(registrations).where(eq(registrations.id, id));
        });

        revalidatePath("/panitia");
        revalidatePath("/panitia/registrations");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting registration:", error);
        return { error: error.message || "Failed to delete registration." };
    }
}

// ADMIN ACTIONS
export async function getAdminEvents() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return [];
    }

    try {
        const allEvents = await db.query.events.findMany({
            with: {
                organizer: true
            },
            orderBy: (events, { desc }) => [desc(events.createdAt)],
        });
        return allEvents;
    } catch (error) {
        console.error("Error fetching admin events:", error);
        return [];
    }
}

export async function getAdminRegistrations() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return [];
    }

    try {
        const allRegistrations = await db.query.registrations.findMany({
            with: {
                event: {
                    with: {
                        organizer: true
                    }
                },
                user: true
            },
            orderBy: (registrations, { desc }) => [desc(registrations.registeredAt)],
        });
        return allRegistrations;
    } catch (error) {
        console.error("Error fetching admin registrations:", error);
        return [];
    }
}
export async function getAdminChartData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return null;
    }

    try {
        const allUsers = await db.query.user.findMany({
            columns: { createdAt: true }
        });
        const allEvents = await db.query.events.findMany({
            columns: { createdAt: true }
        });

        // Group by month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        
        const userData = months.map((month, i) => {
            const count = allUsers.filter(u => {
                const date = new Date(u.createdAt);
                return date.getMonth() === i && date.getFullYear() === currentYear;
            }).length;
            return { name: month, value: count };
        });

        const eventData = months.map((month, i) => {
            const count = allEvents.filter(e => {
                const date = new Date(e.createdAt!);
                return date.getMonth() === i && date.getFullYear() === currentYear;
            }).length;
            return { name: month, value: count };
        });

        const categoryData = await db.select({
            category: events.category,
            count: count()
        }).from(events).groupBy(events.category);

        return {
            growth: userData,
            events: eventData,
            categories: categoryData.map(c => ({ name: c.category, value: c.count }))
        };
    } catch (error) {
        console.error("Error fetching admin chart data:", error);
        return null;
    }
}

export async function getPanitiaChartData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "panitia" && session.user.role !== "admin")) {
        return null;
    }

    try {
        const myEvents = await db.query.events.findMany({
            where: eq(events.organizerId, session.user.id),
            with: {
                registrations: true
            }
        });

        // Registration trends over last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const trends = last7Days.map(day => {
            let count = 0;
            myEvents.forEach(event => {
                count += event.registrations.filter(r => 
                    new Date(r.registeredAt!).toISOString().split('T')[0] === day
                ).length;
            });
            return { name: day.split('-').slice(1).join('/'), value: count };
        });

        // Event capacity vs registrations
        const eventStats = myEvents.map(e => ({
            name: e.title.length > 10 ? e.title.substring(0, 10) + '...' : e.title,
            capacity: e.seats,
            filled: e.seats - e.remainingSeats
        }));

        return {
            trends,
            eventStats
        };
    } catch (error) {
        console.error("Error fetching panitia chart data:", error);
        return null;
    }
}

export async function getUserChartData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    try {
        const regs = await db.query.registrations.findMany({
            where: eq(registrations.userId, session.user.id),
            with: {
                event: true
            }
        });

        // Events joined by category
        const categories: Record<string, number> = {};
        regs.forEach(r => {
            const cat = r.event.category;
            categories[cat] = (categories[cat] || 0) + 1;
        });

        const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));

        // Activity over months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        
        const activity = months.map((month, i) => {
            const count = regs.filter(r => {
                const date = new Date(r.registeredAt!);
                return date.getMonth() === i && date.getFullYear() === currentYear;
            }).length;
            return { name: month, value: count };
        });

        return {
            categories: categoryData,
            activity
        };
    } catch (error) {
        console.error("Error fetching user chart data:", error);
        return null;
    }
}
