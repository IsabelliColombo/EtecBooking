"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BooksGrid } from "@/components/books/books-grid";
import { novidadeToBook, novidadesItems } from "@/lib/novidades";
import { cn } from "@/lib/cn";

export function NovidadesContent() {
  const [activeFilter, setActiveFilter] = useState("todas");
  const books = novidadesItems.map(novidadeToBook);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">Novidades</h1>
          <div className="h-1 w-16 rounded-full bg-primary-600" aria-hidden />
          <p className="max-w-2xl text-body text-muted">
            Fique por dentro das últimas aquisições e atualizações da nossa biblioteca.
          </p>
        </div>

        <Link
          href="/home"
          className={cn(
            "inline-flex items-center gap-2 text-small font-semibold text-primary-600",
            "transition-colors duration-150 hover:text-primary-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 rounded-button px-1",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Link>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setActiveFilter("todas")}
          className={cn(
            "rounded-full px-5 py-2 text-small font-semibold transition-colors duration-150",
            activeFilter === "todas"
              ? "bg-primary-600 text-white"
              : "border border-border bg-surface text-foreground hover:bg-surface-2",
          )}
        >
          Todas
        </button>
      </div>

      <BooksGrid books={books} />
    </>
  );
}
