"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { BooksGrid } from "@/components/books/books-grid";
import type { Book } from "@/lib/mock-books";

interface FeaturedBooksSectionProps {
  books: Book[];
}

export function FeaturedBooksSection({ books }: FeaturedBooksSectionProps) {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-500/10"
              aria-hidden
            >
              <BookOpen className="size-5" />
            </div>
            <h2 className="text-title text-foreground">Livros recomendados</h2>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-primary-500 px-6 text-body font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver todos
          </Link>
        </div>

        {books.length === 0 ? (
          <p className="text-body text-muted">
            Nenhum livro disponível no momento.
          </p>
        ) : (
          <BooksGrid
            books={books}
            className="mx-auto max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          />
        )}
      </div>
    </section>
  );
}
