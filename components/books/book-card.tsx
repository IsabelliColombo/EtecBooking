"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { getBookCoverUrl, type Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  className?: string;
}

export function BookCard({ book, onViewDetails, className }: BookCardProps) {
  const availabilityLabel = book.available ? "Disponível" : "Emprestado";
  const demandLabel = book.available ? "Alta" : "Média";

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm transition-shadow duration-150 hover:shadow-md",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-surface-2">
        <div className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors duration-150 group-hover:bg-primary-50">
          <Heart className="size-4 text-muted" aria-hidden />
        </div>
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={getBookCoverUrl(book.coverSeed)}
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-body font-semibold text-foreground">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-small text-muted">{book.author}</p>
        </div>

        <span className="inline-flex w-fit max-w-full truncate rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary-700">
          {book.category}
        </span>

        <div className="grid grid-cols-1 gap-3 text-small text-muted">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Disponibilidade</p>
            <p className="flex items-center gap-2">
              <span
                className={`inline-block size-2 rounded-full ${book.available ? "bg-success" : "bg-warning"}`}
                aria-hidden
              />
              {availabilityLabel}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-foreground">Demanda</p>
            <p className="flex items-center gap-2 text-error">{demandLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(book)}
          className="mt-auto inline-flex h-11 items-center justify-center rounded-button border border-border bg-primary-600 px-4 text-body font-medium text-white transition-colors duration-150 hover:bg-primary-700"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}
