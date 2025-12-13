import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar Placeholder */}
            <header className="border-b border-zinc-200 py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900">
                        Kibo
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-zinc-600">
                        <Link href="/blog" className="hover:text-zinc-900 transition-colors">Blog</Link>
                        <Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link>
                        <Link href="/faq" className="hover:text-zinc-900 transition-colors">FAQ</Link>
                    </nav>
                    <div className="flex gap-3">
                        <Link href="/register">
                            <Button>Register</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">{children}</main>

            {/* Footer Placeholder */}
            <footer className="bg-zinc-50 border-t border-zinc-200 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
                    &copy; {new Date().getFullYear()} Kibo. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
