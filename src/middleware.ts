import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let session = null;
    try {
        const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });
        
        if (res.ok) {
            const data = await res.json();
            session = data;
        }
    } catch (error) {
        console.error("Proxy session fetch failed:", error);
    }

    if (!session) {
        if (
            request.nextUrl.pathname.startsWith("/admin") || 
            request.nextUrl.pathname.startsWith("/panitia") || 
            request.nextUrl.pathname.startsWith("/user")
        ) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (session) {
        const userRole = session.user.role;

        // Admin check
        if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Panitia check (Admin can also access)
        if (request.nextUrl.pathname.startsWith("/panitia") && userRole !== "panitia" && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        
        // Prevent logged in users from hitting login/register
        if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/panitia/:path*", "/user/:path*", "/login", "/register"],
};
