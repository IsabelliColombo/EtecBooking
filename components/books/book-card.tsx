"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { getBookCoverUrl, type Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  isFavorite: boolean;
  isFavoriteUpdating: boolean;
  onToggleFavorite: (book: Book) => void;
  compact?: boolean;
  className?: string;
}

export function BookCard({
  book,
  onViewDetails,
  isFavorite,
  isFavoriteUpdating,
  onToggleFavorite,
  compact = false,
  className,
}: BookCardProps) {
  const availabilityLabel = book.available ? "Disponível" : "Emprestado";
  const demandLabel = book.available ? "Alta" : "Média";

  return (
    <article
      className={cn(
        "group flex min-w-0 overflow-hidden rounded-card border border-border bg-surface shadow-sm transition-shadow duration-150 hover:shadow-md",
        compact ? "flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-2",
          compact ? "w-24 shrink-0" : "",
        )}
      >
        <div className={cn("absolute z-10", compact ? "right-1.5 top-1.5" : "right-3 top-3")}>
          <button
            type="button"
            onClick={() => onToggleFavorite(book)}
            disabled={isFavoriteUpdating}
            aria-label={
              isFavorite ? `Remover ${book.title} dos favoritos` : `Adicionar ${book.title} aos favoritos`
            }
            aria-pressed={isFavorite}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className={cn(
              "flex items-center justify-center rounded-full bg-white/90 text-muted shadow-sm backdrop-blur-sm transition-colors duration-150 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-wait disabled:opacity-60",
              compact ? "size-8" : "size-10",
            )}
          >
            <Heart
              className={`${compact ? "size-4" : "size-5"} transition-colors ${
                isFavorite ? "fill-red-600 text-red-600" : "text-muted"
              }`}
              aria-hidden
            />
          </button>
        </div>
        <div
          className={cn(
            "relative aspect-[3/4] w-full",
            compact ? "h-32" : "",
          )}
        >
          <Image
            src={getBookCoverUrl(book.coverSeed)}
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col", compact ? "gap-2 p-3" : "gap-3 p-4")}>
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-body font-semibold text-foreground">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-small text-muted">{book.author}</p>
        </div>

        <span className={cn("inline-flex w-fit max-w-full truncate rounded-full border border-border bg-surface-2 text-xs font-medium uppercase tracking-[0.08em] text-primary-700", compact ? "px-2 py-0.5" : "px-3 py-1")}>
          {book.category}
        </span>

        <div className={cn("grid grid-cols-1 text-small text-muted", compact ? "gap-1" : "gap-3")}>
          <div className={compact ? "" : "space-y-1"}>
            {!compact && <p className="font-medium text-foreground">Disponibilidade</p>}
            <p className="flex items-center gap-2">
              <span
                className={`inline-block size-2 rounded-full ${book.available ? "bg-success" : "bg-warning"}`}
                aria-hidden
              />
              {availabilityLabel}
            </p>
          </div>

          {!compact && <div className="space-y-1">
            <p className="font-medium text-foreground">Demanda</p>
            <p className="flex items-center gap-2 text-error">{demandLabel}</p>
          </div>}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(book)}
          className={cn(
            "mt-auto inline-flex items-center justify-center rounded-button border border-border bg-primary-600 text-body font-medium text-white transition-colors duration-150 hover:bg-primary-700",
            compact ? "h-9 px-3 text-small" : "h-11 px-4",
          )}
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}
