"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/mock-books";

interface FeaturedBooksSectionProps {
  books: Book[];
}

export function FeaturedBooksSection({ books }: FeaturedBooksSectionProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
            <h2 className="text-title text-foreground">Livros em Destaque</h2>
          </div>

          <Button className="w-fit rounded-full px-6">Ver todos</Button>
        </div>

        {books.length === 0 ? (
          <p className="text-body text-muted">
            Nenhum livro disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={setSelectedBook}
              />
            ))}
          </div>
        )}
      </div>

      <BookDetailsModal
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </section>
  );
}
