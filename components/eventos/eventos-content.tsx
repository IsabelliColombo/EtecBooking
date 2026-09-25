"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventoCard } from "@/components/eventos/evento-card";
import { EventoDetailsModal } from "@/components/eventos/evento-details-modal";
import { eventosItems, type Evento } from "@/lib/eventos";
import { cn } from "@/lib/cn";

export function EventosContent() {
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">Eventos</h1>
          <div className="h-1 w-16 rounded-full bg-primary-600" aria-hidden />
          <p className="max-w-2xl text-body text-muted">
            Confira os próximos eventos e atividades disponíveis na biblioteca.
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {eventosItems.map((evento) => (
          <EventoCard
            key={evento.id}
            evento={evento}
            onViewDetails={setSelectedEvento}
          />
        ))}
      </div>

      <EventoDetailsModal
        evento={selectedEvento}
        open={selectedEvento !== null}
        onClose={() => setSelectedEvento(null)}
      />
    </>
  );
}
