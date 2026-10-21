"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BooksGrid } from "@/components/books/books-grid";
import type { Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

export function NovidadesContent({ books }: { books: Book[] }) {
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

      {books.length > 0 ? (
        <BooksGrid books={books} />
      ) : (
        <p className="text-body text-muted">
          Nenhuma novidade cadastrada no banco de dados.
        </p>
      )}
    </>
  );
}
