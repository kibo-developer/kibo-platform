export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // This is a mock implementation
    console.log(`[MailService] Sending password reset email to ${email} with token ${token}`);
    return Promise.resolve();
}
