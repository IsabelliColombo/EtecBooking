"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getBookCoverUrl, type Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  className?: string;
}

export function BookCard({ book, onViewDetails, className }: BookCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm",
        "transition-shadow duration-150 hover:shadow-md",
        className,
      )}
    >
      <div className="group/cover relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
        <Image
          src={getBookCoverUrl(book.coverSeed)}
          alt={`Capa do livro ${book.title}`}
          fill
          className="object-cover transition-transform duration-200 ease-in-out group-hover/cover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-body font-semibold text-foreground">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-small text-muted">{book.author}</p>

        <div className="flex items-center gap-2 pt-2">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              book.available ? "bg-success" : "bg-error",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "text-small font-medium",
              book.available ? "text-success" : "text-error",
            )}
          >
            {book.available ? "Disponível" : "Indisponível"}
          </span>
        </div>

        <Button
          variant="secondary"
          className="mt-auto h-10 w-full text-small"
          onClick={() => onViewDetails(book)}
        >
          Ver detalhes
        </Button>
      </div>
    </article>
  );
}
