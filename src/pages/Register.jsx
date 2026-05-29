import LoginForm from "@/components/auth/LoginForm";

export default function Register() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-muted px-4">
            <LoginForm defaultMode="register" />
        </main>
    );
}
