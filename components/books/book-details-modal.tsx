"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookCoverUrl, type Book } from "@/lib/mock-books";
import { cn } from "@/lib/cn";

interface BookDetailsModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

export function BookDetailsModal({ book, open, onClose }: BookDetailsModalProps) {
  const router = useRouter();

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

  if (!open || !book) return null;

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
        aria-labelledby="book-modal-title"
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
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] bg-surface-2 pt-8">
            <Image
              src={getBookCoverUrl(book.coverSeed, 440, 580)}
              alt={`Capa do livro ${book.title}`}
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="space-y-2">
              <h2 id="book-modal-title" className="text-title text-foreground">
                {book.title}
              </h2>
              <p className="text-body text-muted">{book.author}</p>
              <p className="text-small text-muted">{book.category}</p>
            </div>

            <div className="flex items-center gap-2">
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

            <div className="space-y-2">
              <h3 className="text-body font-semibold text-foreground">Sinopse</h3>
              <p className="text-small leading-relaxed text-muted">
                {book.synopsis}
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!book.available}
              onClick={() => {
                router.push(`/reservas?bookId=${encodeURIComponent(book.id)}`);
              }}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
