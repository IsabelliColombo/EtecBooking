"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Falha ao carregar a página:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section
        role="alert"
        className="w-full max-w-lg rounded-card border border-border bg-surface p-6 text-center shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-3 text-body text-muted">
          O banco de dados pode estar indisponível no momento. Tente novamente em
          alguns instantes.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 rounded-button bg-primary-600 px-5 py-3 text-small font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
