"use client";

import { BookOpen, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/home");
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-card bg-primary-500 text-white shadow-lg">
          <BookOpen className="size-8" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-title text-foreground">Biblioteca Online ETEC</h1>
          <p className="text-small text-muted">
            Acesse sua conta para reservar e consultar livros
          </p>
        </div>
      </div>

      <Card padding="lg" className="shadow-lg">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            name="email"
            placeholder="seu@email.com"
            icon={Mail}
            autoComplete="email"
            required
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={Lock}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-small text-muted">
              <input
                type="checkbox"
                name="remember"
                className="size-4 rounded border-border text-primary-500 focus:ring-primary-500/30"
              />
              Lembrar de mim
            </label>
            <a
              href="#"
              className="text-small font-medium text-primary-500 transition-colors duration-150 hover:text-primary-600"
            >
              Esqueci minha senha
            </a>
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>

      <p className="mt-8 text-center text-small text-muted">
        Não tem uma conta?{" "}
        <a
          href="#"
          className="font-medium text-primary-500 transition-colors duration-150 hover:text-primary-600"
        >
          Solicitar acesso
        </a>
      </p>
    </>
  );
}
