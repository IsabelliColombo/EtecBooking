"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookCard } from "@/components/books/book-card";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { Book } from "@/lib/mock-books";
import { buildLoginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/cn";

interface BooksGridProps {
  books: Book[];
  className?: string;
  favoritesOnly?: boolean;
  compact?: boolean;
  initialFavoriteIds?: string[];
}

export function BooksGrid({
  books,
  className,
  favoritesOnly = false,
  compact = false,
  initialFavoriteIds = [],
}: BooksGridProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    () => new Set(initialFavoriteIds),
  );
  const [removedFavoriteIds, setRemovedFavoriteIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(() => new Set());
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFavorites() {
      try {
        const response = await fetch("/api/favoritos", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (response.status === 401) {
          setFavoriteIds(new Set());
          return;
        }

        if (!response.ok) {
          throw new Error("Não foi possível carregar seus favoritos.");
        }

        const data = await response.json();
        if (Array.isArray(data.bookIds)) {
          setFavoriteIds(new Set(data.bookIds.filter((id: unknown) => typeof id === "string")));
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setFavoriteError("Não foi possível carregar seus favoritos.");
      } finally {
        if (!controller.signal.aborted) setFavoritesLoaded(true);
      }
    }

    void loadFavorites();
    return () => controller.abort();
  }, []);

  async function toggleFavorite(book: Book) {
    if (!book.databaseId || updatingIds.has(book.databaseId)) return;

    if (!favoritesLoaded) return;

    const currentlyFavorite = favoriteIds.has(book.databaseId);
    const nextFavorite = !currentlyFavorite;
    setUpdatingIds((current) => new Set(current).add(book.databaseId!));
    setFavoriteError(null);

    try {
      const response = await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.databaseId, favorite: nextFavorite }),
      });

      if (response.status === 401) {
        router.push(buildLoginHref(pathname));
        return;
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível atualizar o favorito.");
      }

      setFavoriteIds((current) => {
        const next = new Set(current);
        if (nextFavorite) next.add(book.databaseId!);
        else next.delete(book.databaseId!);
        return next;
      });

      if (favoritesOnly && !nextFavorite) {
        setRemovedFavoriteIds((current) => new Set(current).add(book.databaseId!));
      }
    } catch (error) {
      setFavoriteError(
        error instanceof Error ? error.message : "Não foi possível atualizar o favorito.",
      );
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current);
        next.delete(book.databaseId!);
        return next;
      });
    }
  }

  const displayedBooks = favoritesOnly
    ? books.filter(
        (book) =>
          favoriteIds.has(book.databaseId ?? "") &&
          !removedFavoriteIds.has(book.databaseId ?? ""),
      )
    : books;

  return (
    <>
      {favoriteError && (
        <p role="alert" className="mb-4 text-small text-error">
          {favoriteError}
        </p>
      )}

      {favoritesOnly && displayedBooks.length === 0 ? (
        <p className="text-small text-muted">Você ainda não tem livros favoritos.</p>
      ) : (
        <div className={cn("grid", className ?? "gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
          {displayedBooks.map((book) => (
            <BookCard
              key={book.databaseId ?? book.id}
              book={book}
              onViewDetails={setSelectedBook}
              isFavorite={favoriteIds.has(book.databaseId ?? "")}
              isFavoriteUpdating={
                !favoritesLoaded || updatingIds.has(book.databaseId ?? "")
              }
              compact={compact}
              onToggleFavorite={(selected) => void toggleFavorite(selected)}
            />
          ))}
        </div>
      )}

      <BookDetailsModal
        book={selectedBook}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
