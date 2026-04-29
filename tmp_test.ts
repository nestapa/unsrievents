import { db } from "./src/db";
import { user, events, registrations } from "./src/db/schema";

async function main() {
    try {
        console.log("Testing DB connection...");
        const users = await db.query.user.findMany();
        console.log("Users count:", users.length);
        
        const evs = await db.query.events.findMany();
        console.log("Events count:", evs.length);
        
        console.log("Database querying works perfectly.");
    } catch (e) {
        console.error("DB Error:", e);
    }
}
main();
