import { LoginForm } from "@/components/login/login-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 bg-cover bg-center blur-sm"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80" />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
