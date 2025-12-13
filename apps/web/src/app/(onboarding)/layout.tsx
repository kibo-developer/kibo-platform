export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
            {children}
        </div>
    );
}
