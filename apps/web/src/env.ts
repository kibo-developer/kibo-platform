import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    APP_ENV: z.enum(["development", "production", "test", "dev"]).default("development"),
});

const processEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    APP_ENV: process.env.APP_ENV,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 4)
    );
    process.exit(1);
}

export const env = parsed.data;
