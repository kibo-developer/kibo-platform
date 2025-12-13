export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-gradient-to-br from-zinc-50 to-zinc-100">
            {children}
        </div>
    );
}
