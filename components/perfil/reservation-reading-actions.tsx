"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ReviewSummary = { rating: number; comment?: string };

type ReservationReadingActionsProps = {
  reservationId: string;
  canMarkComplete: boolean;
  readingCompleted: boolean;
  existingReview?: ReviewSummary;
};

export function ReservationReadingActions({
  reservationId,
  canMarkComplete,
  readingCompleted: initialReadingCompleted,
  existingReview: initialReview,
}: ReservationReadingActionsProps) {
  const router = useRouter();
  const [readingCompleted, setReadingCompleted] = useState(initialReadingCompleted);
  const [review, setReview] = useState<ReviewSummary | undefined>(initialReview);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function markReadingComplete() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/leituras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível concluir a leitura.");
      setReadingCompleted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ocorreu um erro.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, rating: Number(rating), comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a avaliação.");
      setReview({ rating: Number(rating), ...(comment.trim() ? { comment: comment.trim() } : {}) });
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ocorreu um erro.");
    } finally {
      setBusy(false);
    }
  }

  if (!canMarkComplete && !readingCompleted) return null;

  return (
    <div className="mt-3 max-w-xl rounded-card border border-border bg-surface-2 p-4">
      {!readingCompleted ? (
        <div className="space-y-2">
          <p className="text-small text-muted">
            Terminou antes do prazo? Marque a leitura como concluída para avaliar este livro.
            Isso não devolve o livro nem altera a data de devolução.
          </p>
          <Button className="h-10 px-4 text-small" disabled={busy} onClick={markReadingComplete}>
            {busy ? "Salvando..." : "Terminei de ler"}
          </Button>
        </div>
      ) : review ? (
        <p className="text-small font-medium text-foreground" role="status">
          Livro avaliado: {review.rating}/5 ★
        </p>
      ) : (
        <form className="space-y-3" onSubmit={submitReview}>
          <p className="text-small font-medium text-foreground">Leitura concluída. Como você avalia este livro?</p>
          <label className="block text-small text-muted">
            Nota
            <select
              className="mt-1 block h-10 w-full rounded-button border border-border bg-surface px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              required
            >
              <option value="">Selecione de 1 a 5 estrelas</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value} {value === 1 ? "estrela" : "estrelas"}</option>
              ))}
            </select>
          </label>
          <label className="block text-small text-muted">
            Comentário (opcional)
            <textarea
              className="mt-1 block min-h-20 w-full resize-y rounded-button border border-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              maxLength={500}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Compartilhe sua opinião sobre o livro"
            />
          </label>
          <Button type="submit" className="h-10 px-4 text-small" disabled={busy || !rating}>
            {busy ? "Enviando..." : "Enviar avaliação"}
          </Button>
        </form>
      )}
      {error && <p className="mt-2 text-small text-red-700" role="alert">{error}</p>}
    </div>
  );
}
