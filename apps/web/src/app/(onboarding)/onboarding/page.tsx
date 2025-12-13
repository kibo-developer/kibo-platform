"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Form validation schema
const characterSchema = z.object({
    name: z.string().min(2, "Tu nombre debe tener al menos 2 caracteres"),
    gender: z.string().min(1, "Por favor selecciona una opción"),
    birthDate: z.string().min(1, "Por favor ingresa tu fecha de nacimiento"),
    bio: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

export default function OnboardingPage() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const progress = 33; // Step 1 of 3

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<CharacterFormData>({
        resolver: zodResolver(characterSchema),
        mode: "onChange",
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: CharacterFormData) => {
        console.log("Character data:", { ...data, avatar: avatarPreview });
        // TODO: Save to database and navigate to next step
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Progress Bar */}
            <div className="w-full bg-zinc-200 h-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-2xl"
                >
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="text-center space-y-4 pb-8">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Configura tu Personaje
                            </CardTitle>
                            <CardDescription className="text-base md:text-lg text-zinc-600">
                                Toda gran aventura comienza con un nombre. ¿Cómo te llamaremos?
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="w-16 h-16 text-zinc-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
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
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-sm text-zinc-500">Subir foto</p>
                                </div>

                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                                        Tu Nombre
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="¿Cómo te dicen tus amigos?"
                                        {...register("name")}
                                        className={`h-12 text-base border-2 transition-colors ${errors.name ? "border-red-500" : "focus:border-indigo-500"
                                            }`}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Gender Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="text-sm font-medium text-zinc-700">
                                        Género
                                    </Label>
                                    <Select onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}>
                                        <SelectTrigger className="h-12 text-base border-2 focus:border-indigo-500">
                                            <SelectValue placeholder="Selecciona una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hombre">Hombre</SelectItem>
                                            <SelectItem value="mujer">Mujer</SelectItem>
                                            <SelectItem value="no-binario">No Binario</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                            <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-zinc-500">Para dirigirnos a ti correctamente.</p>
                                    {errors.gender && (
                                        <p className="text-sm text-red-500">{errors.gender.message}</p>
                                    )}
                                </div>

                                {/* Birth Date Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate" className="text-sm font-medium text-zinc-700">
                                        Fecha de Nacimiento
                                    </Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        {...register("birthDate")}
                                        className={`h-12 text-base border-2 transition-colors ${errors.birthDate ? "border-red-500" : "focus:border-indigo-500"
                                            }`}
                                    />
                                    <p className="text-xs text-zinc-500">¡Para celebrar tu vuelta al sol!</p>
                                    {errors.birthDate && (
                                        <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                                    )}
                                </div>

                                {/* Bio/Mission Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-sm font-medium text-zinc-700">
                                        Tu Misión Actual
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Cuéntanos un poco sobre ti... ¿Qué quieres lograr este año?"
                                        {...register("bio")}
                                        className="min-h-24 text-base border-2 focus:border-indigo-500 resize-none"
                                        rows={4}
                                    />
                                    <p className="text-xs text-zinc-500">Opcional, pero nos ayuda a conocerte mejor.</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 h-12 text-base"
                                        onClick={() => window.history.back()}
                                    >
                                        Volver
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1 h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
                                        disabled={!isValid}
                                    >
                                        ¡Listo, vamos! 🚀
                                    </Button>
                                </div>

                                {/* Progress Indicator */}
                                <div className="text-center text-sm text-zinc-500 pt-2">
                                    Paso 1 de 3
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
