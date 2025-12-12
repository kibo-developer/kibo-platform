import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@kibo/database"
import Google from "next-auth/providers/google"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // Using JWT for session to avoid database session lookup on every request if preferred, or "database" for strict server-side sessions. "jwt" is often easier for edge but with prisma adapter default is database. Let's explicitly set to jwt for flexibility or keep default.
    // Actually, for a robust app with Prisma adapter, "database" strategy is the default and robust.
    // However, the user request didn't specify. Standard for NextAuth + Role/RPG info on session might benefit from JWT to carry palette payload, OR db session.
    // Let's stick to default (database) for security, or JWT if we want to save DB hits.
    // Given "Account" and "Session" tables exist, "database" strategy is implied.
    // But wait, "Session" table exists, so default is database.
    // Let's leave session strategy to default (which is database when adapter is present).

    providers: [
        Google,
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
            issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user || !user.passwordHash) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
})
