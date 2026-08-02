"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { mockBooks, type Book } from "@/lib/mock-books";

interface ReservationFormState {
  selectedBook: Book | null;
  search: string;
  rm: string;
  name: string;
  course: string;
}

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const initialBookId = searchParams?.get("bookId") ?? "";
  const books = useMemo(() => mockBooks.filter((book) => book.available), []);

  const [form, setForm] = useState<ReservationFormState>({
    selectedBook: null,
    search: "",
    rm: "",
    name: "",
    course: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!initialBookId) return;

    const bookById = books.find((book) => book.id === initialBookId);
    if (!bookById) return;

    setForm((current) => ({
      ...current,
      selectedBook: bookById,
      search: bookById.title,
    }));
  }, [initialBookId, books]);

  const suggestions = useMemo(() => {
    const query = form.search.trim().toLowerCase();
    if (query.length < 1) return [];
    return books.filter((book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query),
    );
  }, [form.search, books]);

  const deadline = "15 dias corridos";

  const courseOptions = [
    "1 MEIO AMBIENTE",
    "2 MEIO AMBIENTE",
    "3 MEIO AMBIENTE",
    "1 NUTRIÇÃO",
    "2 NUTRIÇÃO",
    "3 NUTRIÇÃO",
    "1 QUÍMICA",
    "2 QUÍMICA",
    "3 QUÍMICA",
    "1 MECATRÔNICA",
    "2 MECATRÔNICA",
    "3 MECATRÔNICA",
  ];

  function handleSelectBook(book: Book) {
    setForm((current) => ({
      ...current,
      selectedBook: book,
      search: book.title,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.selectedBook || !form.rm || !form.name || !form.course) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="mb-8 rounded-card border border-border bg-surface p-6 shadow-sm">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-700">
                Reservas
              </p>
              <h1 className="text-3xl font-semibold text-foreground">Nova reserva</h1>
              <p className="text-body text-muted">
                Escolha o livro, confirme seus dados e finalize sua reserva.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <div className="mb-6 rounded-card border border-primary-200 bg-primary-50 p-4 text-body text-foreground">
                <p className="font-semibold">Prazo de devolução</p>
                <p className="text-small text-muted">O prazo padrão de devolução do livro é de {deadline}.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="text-small font-medium text-foreground">Buscar livro</label>
                  <Input
                    placeholder="Digite o nome do livro..."
                    value={form.search}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        search: event.target.value,
                      }));
                    }}
                  />
                  {suggestions.length > 0 && (
                    <div className="max-h-64 overflow-auto rounded-card border border-border bg-surface text-small shadow-sm">
                      {suggestions.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          className="w-full border-b border-border px-4 py-3 text-left transition-colors duration-150 hover:bg-primary-50"
                          onClick={() => handleSelectBook(book)}
                        >
                          <div className="font-medium text-foreground">{book.title}</div>
                          <div className="text-muted">{book.author}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="RM"
                    placeholder="Digite o RM"
                    value={form.rm}
                    onChange={(event) => setForm((current) => ({ ...current, rm: event.target.value }))}
                  />
                  <Input
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label htmlFor="course" className="text-small font-medium text-foreground">
                    Curso
                  </label>
                  <select
                    id="course"
                    value={form.course}
                    onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
                    className="h-12 w-full rounded-input border border-border bg-surface px-4 text-body text-foreground outline-none transition-all duration-150 ease-in-out focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="">Selecione um curso</option>
                    {courseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Confirmar reserva
                </Button>
              </form>

              {form.selectedBook && (
                <div className="mt-6 rounded-card border border-border bg-surface-2 p-4">
                  <p className="text-small font-medium text-foreground">Livro escolhido</p>
                  <p className="text-body text-foreground font-semibold">{form.selectedBook.title}</p>
                  <p className="text-small text-muted">{form.selectedBook.author}</p>
                </div>
              )}

              {submitted && (
                <div className="mt-6 rounded-card bg-success p-4 text-white shadow-sm">
                  <p className="font-semibold">Sucesso na sua reserva!</p>
                  <p className="text-small">Sua reserva foi registrada com sucesso.</p>
                </div>
              )}
            </div>

            <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-700 grid place-items-center">
                    <span className="text-lg font-bold">R</span>
                  </div>
                  <div>
                    <p className="text-small font-medium text-foreground">Resumo da reserva</p>
                    <p className="text-muted">Confira o livro e os dados antes de confirmar.</p>
                  </div>
                </div>
                <div className="space-y-3 rounded-card border border-border bg-background p-4">
                  <p className="text-small text-muted">Livro selecionado</p>
                  <p className="font-medium text-foreground">{form.selectedBook?.title ?? "Nenhum livro selecionado"}</p>
                </div>
                <div className="space-y-3 rounded-card border border-border bg-background p-4">
                  <p className="text-small text-muted">Dados do aluno</p>
                  <p className="font-medium text-foreground">{form.name || "Nome não preenchido"}</p>
                  <p className="text-small text-muted">RM: {form.rm || "Não preenchido"}</p>
                  <p className="text-small text-muted">Curso: {form.course || "Não preenchido"}</p>
                </div>
              </div>
              <div className="rounded-card border border-border bg-primary-50 p-4 text-sm text-foreground">
                <p className="font-medium">Dica:</p>
                <p className="text-muted">Busque pelo nome completo para encontrar o livro mais rápido.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
