"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ReservationBook = {
  id: string;
  title: string;
  author: string;
  available: boolean;
};

type ReservationFormProps = {
  aluno: {
    nome: string;
    matricula: string;
    curso: string;
  };
  initialBookId: string;
};

type Message = { kind: "error" | "success"; text: string } | null;

export function ReservationForm({
  aluno,
  initialBookId,
}: ReservationFormProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ReservationBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<ReservationBook | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingAvailabilityAlert, setIsUpdatingAvailabilityAlert] = useState(false);
  const [isSubscribedForAvailability, setIsSubscribedForAvailability] = useState(false);
  const [reservationSucceeded, setReservationSucceeded] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [availabilityAlertError, setAvailabilityAlertError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>(null);
  const availabilityControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!initialBookId) return;

    const controller = new AbortController();

    async function loadInitialBook() {
      try {
        const response = await fetch(
          `/api/reservas?bookId=${encodeURIComponent(initialBookId)}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!response.ok || !data.book) return;

        setSelectedBook(data.book);
        setSearch(data.book.title);
        if (!data.book.available) {
          setMessage({
            kind: "error",
            text: "LIVRO NÃO DISPONÍVEL",
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setSearchError("Não foi possível consultar o livro agora.");
      }
    }

    void loadInitialBook();
    return () => controller.abort();
  }, [initialBookId]);

  useEffect(() => {
    if (!selectedBook || selectedBook.available || reservationSucceeded) return;

    const selectedBookId = selectedBook.id;
    const controller = new AbortController();

    async function loadAvailabilityAlert() {
      try {
        const response = await fetch(
          `/api/notificacoes?bookId=${encodeURIComponent(selectedBookId)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Não foi possível consultar seus avisos.");
        }

        setIsSubscribedForAvailability(data.isSubscribed === true);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setAvailabilityAlertError(
          error instanceof Error
            ? error.message
            : "Não foi possível consultar seus avisos.",
        );
      }
    }

    void loadAvailabilityAlert();
    return () => controller.abort();
  }, [selectedBook, reservationSucceeded]);

  useEffect(() => {
    const query = search.trim();

    if (!query || selectedBook?.title === query || isCheckingAvailability) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/reservas?busca=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Não foi possível buscar os livros.");
        }

        setResults(data.books);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setSearchError(
          error instanceof Error
            ? error.message
            : "Não foi possível buscar os livros.",
        );
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, selectedBook, isCheckingAvailability]);

  function handleSearchChange(value: string) {
    availabilityControllerRef.current?.abort();
    availabilityControllerRef.current = null;
    setSearch(value);
    setSelectedBook(null);
    setIsSubscribedForAvailability(false);
    setReservationSucceeded(false);
    setIsCheckingAvailability(false);
    setResults([]);
    setIsSearching(Boolean(value.trim()));
    setMessage(null);
    setSearchError(null);
    setAvailabilityAlertError(null);
  }

  async function handleSelectBook(book: ReservationBook) {
    availabilityControllerRef.current?.abort();
    const controller = new AbortController();
    availabilityControllerRef.current = controller;
    setSearch(book.title);
    setResults([]);
    setSelectedBook(null);
    setIsSubscribedForAvailability(false);
    setReservationSucceeded(false);
    setIsSearching(false);
    setIsCheckingAvailability(true);
    setSearchError(null);
    setMessage(null);
    setAvailabilityAlertError(null);

    try {
      const response = await fetch(
        `/api/reservas?bookId=${encodeURIComponent(book.id)}`,
        { signal: controller.signal },
      );
      const data = await response.json();

      if (!response.ok || !data.book) {
        throw new Error(data.error ?? "Não foi possível consultar o livro.");
      }

      const livroAtual: ReservationBook = data.book;
      setSelectedBook(livroAtual);
      if (!livroAtual.available) {
        setMessage({ kind: "error", text: "LIVRO NÃO DISPONÍVEL" });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setSearchError(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o livro.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsCheckingAvailability(false);
        if (availabilityControllerRef.current === controller) {
          availabilityControllerRef.current = null;
        }
      }
    }
  }

  async function toggleAvailabilityAlert() {
    if (!selectedBook || selectedBook.available || isUpdatingAvailabilityAlert) return;

    const action = isSubscribedForAvailability ? "cancel" : "subscribe";
    setIsUpdatingAvailabilityAlert(true);
    setAvailabilityAlertError(null);

    try {
      const response = await fetch("/api/notificacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook.id, action }),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 409 && data?.code === "BOOK_AVAILABLE") {
        setSelectedBook((current) =>
          current ? { ...current, available: true } : current,
        );
        setMessage({
          kind: "success",
          text: "Este livro já está disponível. Você já pode reservá-lo.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível atualizar seu aviso.");
      }

      setIsSubscribedForAvailability(action === "subscribe");
    } catch (error) {
      setAvailabilityAlertError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seu aviso.",
      );
    } finally {
      setIsUpdatingAvailabilityAlert(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBook || !selectedBook.available || isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook.id }),
      });
      const data = await response.json();

      if (response.status === 409) {
        setReservationSucceeded(false);
        setSelectedBook({ ...selectedBook, available: false });
        setMessage({
          kind: "error",
          text: "LIVRO NÃO DISPONÍVEL",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível reservar o livro.");
      }

      setReservationSucceeded(true);
      setSelectedBook({ ...selectedBook, available: false });
      setMessage({ kind: "success", text: "Livro reservado com sucesso!" });
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Não foi possível reservar o livro.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-8 rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-700">
            Reservas
          </p>
          <h1 className="text-3xl font-semibold text-foreground">Nova reserva</h1>
          <p className="text-body text-muted">
            Escolha um livro disponível para reservar.
          </p>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 rounded-card border border-primary-200 bg-primary-50 p-4 text-body text-foreground">
          <p className="font-semibold">Prazo de devolução</p>
          <p className="text-small text-muted">
            O prazo padrão de devolução do livro é de 15 dias corridos.
          </p>
        </div>

        <div className="mb-6 rounded-card border border-border bg-surface-2 p-4">
          <p className="text-small font-medium text-muted">Reservando como</p>
          <p className="text-body font-semibold text-foreground">{aluno.nome}</p>
          <p className="text-small text-muted">
            RM {aluno.matricula} · {aluno.curso}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Input
              label="Buscar livro"
              placeholder="Digite o nome ou autor do livro..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              autoComplete="off"
            />

            {isSearching && <p className="text-small text-muted">Buscando livros...</p>}
            {isCheckingAvailability && (
              <p className="text-small text-muted">
                Consultando disponibilidade no banco de dados...
              </p>
            )}
            {searchError && (
              <p role="alert" className="text-small text-error">
                {searchError}
              </p>
            )}

            {results.length > 0 && (
              <div className="max-h-64 overflow-auto rounded-card border border-border bg-surface text-small shadow-sm">
                {results.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 border-b border-border px-4 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-primary-50"
                    onClick={() => void handleSelectBook(book)}
                  >
                    <span>
                      <span className="block font-medium text-foreground">
                        {book.title}
                      </span>
                      <span className="text-muted">{book.author}</span>
                    </span>
                    <span
                      className={
                        book.available ? "text-success" : "text-error"
                      }
                    >
                      {book.available ? "Disponível" : "Indisponível"}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!isSearching &&
              search.trim().length > 0 &&
              !selectedBook &&
              !isCheckingAvailability &&
              results.length === 0 &&
              !searchError && (
                <p className="text-small text-muted">Nenhum livro encontrado.</p>
              )}
          </div>

          {selectedBook && (
            <div className="rounded-card border border-border bg-surface-2 p-4">
              <p className="text-small font-medium text-foreground">Livro escolhido</p>
              <p className="text-body font-semibold text-foreground">
                {selectedBook.title}
              </p>
              <p className="text-small text-muted">{selectedBook.author}</p>
              <p
                className={
                  selectedBook.available
                    ? "mt-2 text-small font-medium text-success"
                    : "mt-2 text-small font-medium text-error"
                }
              >
                {selectedBook.available ? "Disponível agora" : "Indisponível"}
              </p>
            </div>
          )}

          {selectedBook && !selectedBook.available && !reservationSucceeded && (
            <div
              className="rounded-card border border-border bg-surface-2 p-4"
              aria-live="polite"
            >
              <p className="font-medium text-foreground">
                Quer ser avisado quando este livro estiver disponível?
              </p>
              <p className="mt-1 text-small text-muted">
                O aviso aparecerá no sino de notificações. Ele não reserva o livro automaticamente.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 w-full sm:w-auto"
                disabled={isUpdatingAvailabilityAlert}
                onClick={() => void toggleAvailabilityAlert()}
              >
                {isUpdatingAvailabilityAlert
                  ? "Atualizando aviso..."
                  : isSubscribedForAvailability
                    ? "Cancelar aviso"
                    : "Quero ser avisado"}
              </Button>
              {availabilityAlertError && (
                <p role="alert" className="mt-2 text-small text-error">
                  {availabilityAlertError}
                </p>
              )}
              {isSubscribedForAvailability && (
                <p className="mt-2 text-small text-success">
                  Você será avisado quando o livro voltar a ficar disponível.
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedBook?.available || isSubmitting}
          >
            {isSubmitting
              ? "Reservando..."
              : isCheckingAvailability
                ? "Verificando disponibilidade..."
                : "Confirmar reserva"}
          </Button>
        </form>

        {message && (
          <div
            role={message.kind === "error" ? "alert" : "status"}
            className={`mt-6 rounded-card p-4 text-small ${
              message.kind === "success"
                ? "bg-success text-white"
                : "bg-error/10 text-error"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </>
  );
}
