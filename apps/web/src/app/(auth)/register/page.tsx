"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Chrome } from "lucide-react";

// Validation schema
const registerSchema = z.object({
    email: z.string().email("Email inválido"),
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setApiError(result.error || "Error al crear la cuenta");
                setIsLoading(false);
                return;
            }

            // Show success message
            setShowSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setApiError("Error de conexión. Por favor intenta de nuevo.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px]"
            >
                <Card className="w-full border shadow-sm bg-white">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-semibold text-zinc-900">
                            Crear Cuenta
                        </CardTitle>
                        <CardDescription className="text-zinc-500">
                            Únete a Kibo y comienza tu aventura
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
                                    O regístrate con
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* API Error Message */}
                            <AnimatePresence>
                                {apiError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm"
                                    >
                                        {apiError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Success Message */}
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        ¡Cuenta creada! Redirigiendo...
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-zinc-700">
                                    Nombre de Usuario
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="tu_nombre_usuario"
                                    {...register("username")}
                                    className={`h-10 border-zinc-300 ${errors.username ? "border-red-500" : "focus:border-[#40E0D0] focus:ring-[#40E0D0]"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.username && (
                                    <p className="text-xs text-red-500">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    {...register("email")}
                                    className={`h-10 border-zinc-300 ${errors.email ? "border-red-500" : "focus:border-[#40E0D0] focus:ring-[#40E0D0]"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`h-10 border-zinc-300 ${errors.password ? "border-red-500" : "focus:border-[#40E0D0] focus:ring-[#40E0D0]"
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-10 bg-[#40E0D0] hover:bg-[#3bddcd] text-white font-medium transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    "Crear Cuenta"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-zinc-600">
                        <div className="text-center">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="text-[#40E0D0] hover:text-[#3bddcd] font-medium transition-colors">
                                Inicia sesión
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
