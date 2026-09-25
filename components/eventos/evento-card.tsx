"use client";

import Image from "next/image";
import type { Evento } from "@/lib/eventos";
import { cn } from "@/lib/cn";

interface EventoCardProps {
  evento: Evento;
  onViewDetails: (evento: Evento) => void;
  className?: string;
}

export function EventoCard({ evento, onViewDetails, className }: EventoCardProps) {
  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm transition-shadow duration-150 hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
        <Image
          src={evento.imageUrl}
          alt={`Imagem do evento ${evento.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-small text-muted">{evento.year}</p>
          <h3 className="line-clamp-2 text-body font-semibold text-foreground">
            {evento.title}
          </h3>
        </div>

        <span className="inline-flex w-fit max-w-full truncate rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary-700">
          {evento.category}
        </span>

        <button
          type="button"
          onClick={() => onViewDetails(evento)}
          className="mt-auto inline-flex h-11 items-center justify-center rounded-button border border-border bg-primary-600 px-4 text-body font-medium text-white transition-colors duration-150 hover:bg-primary-700"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}
