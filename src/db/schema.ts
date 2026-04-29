import { pgTable, text, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
    fullName: text("full_name"),
    phone: varchar("phone", { length: 256 }),
    role: text("role").$type<"admin" | "panitia" | "user">().default("user"),
});

export const userRelations = relations(user, ({ many }) => ({
    organizedEvents: many(events),
    registrations: many(registrations),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

export const events = pgTable("events", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    date: timestamp("date").notNull(),
    location: text("location").notNull(),
    image: text("image"),
    price: text("price").default("Gratis"),
    seats: integer("seats").notNull(),
    remainingSeats: integer("remaining_seats").notNull(),
    organizerId: text("organizer_id").references(() => user.id).notNull(),
    status: text("status").$type<"draft" | "published" | "ended">().default("published"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const eventRelations = relations(events, ({ one, many }) => ({
    organizer: one(user, {
        fields: [events.organizerId],
        references: [user.id],
    }),
    registrations: many(registrations),
}));

export const registrations = pgTable("registrations", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id).notNull(),
    eventId: text("event_id").references(() => events.id).notNull(),
    status: text("status").$type<"pending" | "confirmed" | "cancelled">().default("confirmed"),
    registeredAt: timestamp("registered_at").defaultNow(),
});

export const registrationRelations = relations(registrations, ({ one }) => ({
    user: one(user, {
        fields: [registrations.userId],
        references: [user.id],
    }),
    event: one(events, {
        fields: [registrations.eventId],
        references: [events.id],
    }),
}));
