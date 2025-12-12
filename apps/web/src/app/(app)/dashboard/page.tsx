"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  const handleInitialize = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }

      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "srtortolero@gmail.com",
          username: "KiboDev",
          firstName: "Sergio Ricardo VI",
          lastName: "Tortolero Lopez",
          passwordHash: "55152478Tortolero*",
        }),
      });

      if (response.ok) {
        alert("Hero KiboDev Initialized!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to initialize user:", response.status, errorData);
        alert("Failed to initialize user. Check console for details.");
      }
    } catch (error) {
      console.error("Error initializing user:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 gap-4">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Kibo</h1>
      <p className="text-zinc-500">Operating System: Online</p>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleInitialize}>Initialize</Button>
        <Button variant="outline">System Check</Button>
      </div>
    </main>
  );
}
