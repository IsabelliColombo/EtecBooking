"use client";

import { useState } from "react";
import { BookCard } from "@/components/books/book-card";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

interface BooksGridProps {
  books: Book[];
  className?: string;
}

export function BooksGrid({ books, className }: BooksGridProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      <div className={cn("grid", className ?? "gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} onViewDetails={setSelectedBook} />
        ))}
      </div>

      <BookDetailsModal
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
