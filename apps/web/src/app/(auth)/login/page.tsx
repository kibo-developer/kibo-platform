
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Chrome, Grip } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    return (
        <Card className="w-[380px]">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to Kibo</CardTitle>
                <CardDescription>
                    Login to continue your journey
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form
                    action={async () => {
                        "use server"
                        await signIn("microsoft-entra-id", { redirectTo: "/dashboard" })
                    }}
                >
                    <Button variant="outline" className="w-full gap-2" type="submit">
                        <Grip className="h-5 w-5 text-blue-500" />
                        Continue with Microsoft
                    </Button>
                </form>

                <form
                    action={async () => {
                        "use server"
                        await signIn("google", { redirectTo: "/dashboard" })
                    }}
                >
                    <Button variant="outline" className="w-full gap-2" type="submit">
                        <Chrome className="h-5 w-5 text-red-500" />
                        Continue with Google
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                {/* Placeholder for Credentials or Magic Link if we add them later */}
                <Button variant="secondary" className="w-full" disabled>
                    Email (Coming Soon)
                </Button>

            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <div className="text-center">
                    New to Kibo?{" "}
                    <Link href="/register" className="underline hover:text-primary">
                        Register (Soon)
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
