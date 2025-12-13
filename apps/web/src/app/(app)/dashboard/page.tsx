"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {


  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Header with Logout */}
      <header className="flex w-full items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-bold">Kibo</h1>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log Out
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Kibo</h1>
        <p className="text-zinc-500">Operating System: Online</p>
        <div className="flex gap-2 mt-4">

          <Button variant="outline">System Check</Button>
        </div>
      </main>
    </div>
  );
}
