"use client";

import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { getBookCoverUrl } from "@/lib/mock-books";
import {
  formatNovidadeDate,
  type NovidadeItem,
} from "@/lib/novidades";
import { cn } from "@/lib/cn";

interface NovidadeCardProps {
  item: NovidadeItem;
  onViewDetails: (item: NovidadeItem) => void;
  className?: string;
}

export function NovidadeCard({
  item,
  onViewDetails,
  className,
}: NovidadeCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm",
        "transition-shadow duration-150 hover:shadow-md",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-surface-2">
        <span
          className="absolute left-3 top-3 z-10 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
        >
          Livro
        </span>
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={getBookCoverUrl(item.coverSeed)}
            alt={`Capa do livro ${item.title}`}
            fill
            className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-2 text-small text-muted">
          <Calendar className="size-4 shrink-0 text-primary-600" aria-hidden />
          {formatNovidadeDate(item.addedAt)}
        </p>

        <h3 className="line-clamp-2 text-body font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="text-small text-muted">{item.author}</p>
        <p className="line-clamp-2 text-small text-muted">
          {item.genres.join(", ")}
        </p>

        <button
          type="button"
          onClick={() => onViewDetails(item)}
          className={cn(
            "mt-auto flex items-center justify-between gap-3 pt-3 text-left",
            "cursor-pointer transition-colors duration-150 hover:text-primary-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 rounded-button",
          )}
        >
          <span className="text-small font-semibold text-primary-600">
            Ver detalhes
          </span>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              "bg-primary-50 text-primary-600 transition-colors duration-150",
              "group-hover:bg-primary-100",
            )}
            aria-hidden
          >
            <ArrowRight className="size-4" />
          </span>
        </button>
      </div>
    </article>
  );
}
