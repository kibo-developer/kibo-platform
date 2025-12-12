import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center max-w-4xl mx-auto px-4">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900">
                    Your Personal <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500">Operating System</span>.
                </h1>

                <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                    Gamify your life. Master your focus. <br className="hidden md:block" />
                    The Second Brain with a Zen philosophy.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all hover:scale-105 shadow-lg"
                    >
                        Start Onboarding
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
                    >
                        Learn Philosophy
                    </Link>
                </div>
            </div>

            {/* Visual Placeholder / Abstract Graphic could go here */}
            <div className="mt-20 w-full h-64 md:h-96 bg-gradient-to-b from-zinc-100 to-white rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-300">
                <span className="text-sm uppercase tracking-widest font-semibold">Dashboard Preview</span>
            </div>
        </div>
    );
}
