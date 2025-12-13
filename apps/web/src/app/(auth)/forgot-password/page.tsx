"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await requestPasswordReset(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Algo salió mal. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
            <Card className="w-full max-w-[400px] border shadow-sm bg-white">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-semibold text-zinc-900">
                        Recuperar Contraseña
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                        Te enviaremos un enlace para restablecer tu contraseña
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm text-center">
                            <p className="font-medium">¡Correo enviado!</p>
                            <p className="mt-1">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-4">
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
                                    name="email"
                                    type="email"
                                    placeholder="tu@email.com"
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
                                {isLoading ? "Enviando..." : "Enviar Enlace"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-zinc-600">
                    <Link href="/login" className="text-[#40E0D0] hover:text-[#3bddcd] font-medium transition-colors">
                        Volver al inicio de sesión
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
