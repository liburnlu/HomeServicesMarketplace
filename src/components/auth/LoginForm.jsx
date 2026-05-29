import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        console.log({ email, password });

        // later: Supabase login here
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your email and password to access your account.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}