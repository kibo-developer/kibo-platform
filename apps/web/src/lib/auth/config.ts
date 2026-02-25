import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding')

            if (isOnDashboard || isOnOnboarding) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If user is logged in and trying to access auth pages (like login/register),
                // we could redirect them to dashboard, but for now we'll just allow them to stay 
                // or let the UI handle it. 
                // A common pattern is redirecting logged in users away from /login:
                if (nextUrl.pathname === '/login') {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
            }
            return true
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
