import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { password } = body;

        const correctPassword = process.env.SITE_PASSWORD || "nexus_admin";

        if (password === correctPassword) {
            const response = NextResponse.json({ success: true });
            
            response.cookies.set({
                name: 'nexus_auth',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30 // 30 days
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: "Invalid password" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
