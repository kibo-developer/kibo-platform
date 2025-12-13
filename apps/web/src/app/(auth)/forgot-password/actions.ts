"use server";

import { sendPasswordResetEmail } from "@/lib/mail-service";

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    // Generate a mock token
    const token = Math.random().toString(36).substring(7);

    try {
        await sendPasswordResetEmail(email, token);
        return { success: true };
    } catch (error) {
        console.error("Failed to send reset email:", error);
        return { error: "Failed to send reset email" };
    }
}
