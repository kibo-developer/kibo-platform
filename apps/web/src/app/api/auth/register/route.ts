import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kibo/database";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
    email: z.string().email("Email inválido"),
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { email, username, password } = validationResult.data;

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: "Este correo electrónico ya está registrado" },
                { status: 409 }
            );
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Este nombre de usuario ya está en uso" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
                name: username, // Use username as default name
                // emailVerified is null by default (skipping verification)
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                createdAt: true,
                // Explicitly exclude passwordHash from response
            },
        });

        return NextResponse.json(
            {
                message: "¡Cuenta creada exitosamente!",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Error al crear la cuenta. Por favor intenta de nuevo." },
            { status: 500 }
        );
    }
}
