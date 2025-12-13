"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Chrome } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciales inválidas");
                setIsLoading(false);
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Error al iniciar sesión");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
            <Card className="w-full max-w-[400px] mx-auto border shadow-sm bg-white">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-semibold text-zinc-900">
                        Bienvenido a Kibo
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                        Inicia sesión para continuar tu aventura
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* OAuth Providers */}
                    <div className="grid grid-cols-2 gap-3">
                        <form
                            action={async () => {
                                await signIn("microsoft-entra-id", { redirectTo: "/dashboard" });
                            }}
                        >
                            <Button variant="outline" className="w-full gap-2 h-10 bg-white hover:bg-zinc-50" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
                                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                                </svg>
                                Microsoft
                            </Button>
                        </form>

                        <form
                            action={async () => {
                                await signIn("google", { redirectTo: "/dashboard" });
                            }}
                        >
                            <Button variant="outline" className="w-full gap-2 h-10 bg-white hover:bg-zinc-50" type="submit">
                                <Chrome className="h-4 w-4" />
                                Google
                            </Button>
                        </form>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-500">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    {/* Credentials Login Form */}
                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 border-zinc-300 focus:border-[#40E0D0] focus:ring-[#40E0D0]"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                                    Contraseña
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-zinc-500 hover:text-[#40E0D0] transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 border-zinc-300 focus:border-[#40E0D0] focus:ring-[#40E0D0]"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 bg-[#40E0D0] hover:bg-[#3bddcd] text-white font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-zinc-600">
                    <div className="text-center">
                        ¿Nuevo en Kibo?{" "}
                        <Link href="/register" className="text-[#40E0D0] hover:text-[#3bddcd] font-medium transition-colors">
                            Crear cuenta
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
