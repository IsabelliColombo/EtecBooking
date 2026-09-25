"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Evento } from "@/lib/eventos";
import { cn } from "@/lib/cn";

interface EventoDetailsModalProps {
  evento: Evento | null;
  open: boolean;
  onClose: () => void;
}

export function EventoDetailsModal({
  evento,
  open,
  onClose,
}: EventoDetailsModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !evento) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="evento-modal-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-modal border border-border bg-surface shadow-lg"
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full",
            "bg-surface/90 text-muted shadow-sm backdrop-blur-sm",
            "transition-colors duration-150 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
          )}
          aria-label="Fechar"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="overflow-y-auto">
          <div className="relative aspect-[16/10] w-full bg-surface-2">
            <Image
              src={evento.imageUrl}
              alt={`Imagem do evento ${evento.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="space-y-1">
              <p className="text-small text-muted">{evento.year}</p>
              <h2
                id="evento-modal-title"
                className="text-title font-semibold text-foreground"
              >
                {evento.title}
              </h2>
              <span className="mt-2 inline-flex rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary-700">
                {evento.category}
              </span>
            </div>

            <p className="text-body text-muted">{evento.description}</p>

            <dl className="grid gap-3 text-small">
              <div>
                <dt className="font-medium text-foreground">Data</dt>
                <dd className="text-muted">{evento.dateLabel}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Local</dt>
                <dd className="text-muted">{evento.location}</dd>
              </div>
            </dl>

            <Button type="button" onClick={onClose} className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
