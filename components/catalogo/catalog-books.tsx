"use client";

import { Suspense, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BooksGrid } from "@/components/books/books-grid";
import { CategoryFilter } from "@/components/catalogo/category-filter";
import { Input } from "@/components/ui/input";
import type { Book } from "@/lib/mock-books";

type SortOption = "titulo" | "autor" | "disponibilidade";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function CatalogBooks({
  books,
  categories,
}: {
  books: Book[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("titulo");

  const filteredBooks = useMemo(() => {
    const query = normalizeText(search);
    const matchingBooks = books.filter((book) => {
      if (sortBy === "disponibilidade" && !book.available) return false;
      if (!query) return true;

      return [book.title, book.author].some((value) =>
        normalizeText(value).includes(query),
      );
    });

    return matchingBooks.sort((first, second) => {
      const primaryField = sortBy === "autor" ? "author" : "title";
      const primaryOrder = first[primaryField].localeCompare(
        second[primaryField],
        "pt-BR",
        { sensitivity: "base" },
      );

      if (primaryOrder !== 0) return primaryOrder;
      return first.title.localeCompare(second.title, "pt-BR", { sensitivity: "base" });
    });
  }, [books, search, sortBy]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label=""
          icon={Search}
          placeholder="Buscar por título ou autor..."
          aria-label="Buscar livros por título ou autor"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-12"
        />
        <Suspense
          fallback={
            <div className="h-12 rounded-button border border-border bg-surface" />
          }
        >
          <CategoryFilter categories={categories} />
        </Suspense>
        <label className="sr-only" htmlFor="catalog-sort">
          Ordenar livros
        </label>
        <select
          id="catalog-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          aria-label="Ordenar livros"
          className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
        >
          <option value="titulo">Ordenar por: Título</option>
          <option value="autor">Ordenar por: Autor</option>
          <option value="disponibilidade">Disponibilidade: somente disponíveis</option>
        </select>
      </div>

      <div className="mb-6 mt-8 rounded-card border border-border bg-surface p-4 shadow-sm">
        <p className="text-body text-foreground" aria-live="polite">
          <span className="font-semibold text-foreground">{filteredBooks.length}</span>{" "}
          {filteredBooks.length === 1 ? "livro encontrado" : "livros encontrados"}
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="text-body text-muted">
          {search.trim()
            ? "Nenhum livro do acervo corresponde à sua busca."
            : "Nenhum livro encontrado para esta categoria."}
        </p>
      ) : (
        <BooksGrid books={filteredBooks} />
      )}
    </>
  );
}
