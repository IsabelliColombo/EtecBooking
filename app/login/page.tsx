import { LoginForm } from "@/components/login/login-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
