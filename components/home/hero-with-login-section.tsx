"use client";

import { BookOpen, MapPin, Search, Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const quickActions = [
  {
    icon: MapPin,
    title: "Acesse de onde estiver",
  },
  {
    icon: Search,
    title: "Encontre o que precisa",
  },
  {
    icon: Bookmark,
    title: "Aprenda e evolua sempre",
  },
];

export function HeroWithLoginSection() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/login");
  }

  return (
    <section className="relative flex flex-1 overflow-hidden">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-150784272343-583f20270319?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      {/* Content Container */}
      <div className="relative z-10 flex w-full items-center">
        {/* Left side - Hero Content */}
        <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-16 md:px-12 lg:px-16">
          {/* Book Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <BookOpen className="h-10 w-10 text-white" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Bem-vindo à<br />
              Biblioteca On-line
            </h1>
            <p className="max-w-md text-lg text-white/90">
              Acesse milhares de livros, artigos e materiais acadêmicos de forma
              prática e rápida.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">{action.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-12 md:px-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Etec</h2>
                <p className="text-xs text-muted">
                  Prefeito Alberto Feres
                </p>
                <p className="text-xs text-muted">Araras</p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Acesse sua conta
            </h3>
            <p className="text-sm text-muted">
              Entre com seu RM e senha para continuar.
            </p>
          </div>

          {/* Form Card */}
          <Card padding="lg" className="w-full shadow-xl">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* RM Input */}
              <Input
                label="RM"
                type="text"
                name="rm"
                placeholder="Digite seu RM"
                autoComplete="username"
                required
              />

              {/* Password Input */}
              <Input
                label="Senha"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Esqueceu sua senha?
                </a>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800">
                ENTRAR
              </Button>
            </form>
          </Card>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-muted">
            Ainda não tem acesso?{" "}
            <a href="#" className="font-medium text-red-600 hover:text-red-700">
              Fale com a biblioteca.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
