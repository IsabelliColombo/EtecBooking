"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Hash, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PrimeiroAcessoForm() {
  const router = useRouter();
  const [rm, setRm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRmChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 5);
    setRm(digitsOnly);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (rm.length !== 5) {
      setErro("O RM deve ter 5 dígitos.");
      return;
    }

    if (password.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmar) {
      setErro("As senhas não são iguais.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resposta = await fetch("/api/primeiroacesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rm, email, password }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(dados?.error ?? "Não foi possível cadastrar a senha.");
        setIsSubmitting(false);
        return;
      }

      router.push("/login");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-card bg-primary-500 text-white shadow-lg">
          <BookOpen className="size-8" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-title text-foreground">Primeiro acesso</h1>
          <p className="text-small text-muted">
            Informe seu RM e o e-mail cadastrado na escola para criar sua senha
          </p>
        </div>
      </div>

      <Card padding="lg" className="shadow-lg">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            label="RM"
            type="text"
            name="rm"
            value={rm}
            onChange={handleRmChange}
            inputMode="numeric"
            maxLength={5}
            placeholder="Digite seu RM"
            icon={Hash}
            autoComplete="username"
          />

          <Input
            label="E-mail cadastrado"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            icon={Mail}
            autoComplete="email"
          />

          <Input
            label="Nova senha"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            icon={Lock}
            autoComplete="new-password"
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmar"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Repita a senha"
            icon={Lock}
            autoComplete="new-password"
          />

          {erro && (
            <p role="alert" className="text-small text-red-600">
              {erro}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Criar senha"}
          </Button>

          <p className="text-center text-small text-muted">
            Já tem senha?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-500 transition-colors duration-150 hover:text-primary-600"
            >
              Entrar
            </Link>
          </p>
        </form>
      </Card>
    </>
  );
}
