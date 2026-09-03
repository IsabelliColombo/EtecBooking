import type { BookDocument } from "@/lib/db/types";
import { getBooksCollection } from "@/lib/mongodb";
import { mockBooks, type Book } from "@/lib/mock-books";

function toBook(document: BookDocument): Book {
  return {
    id: document.id,
    title: document.title,
    author: document.author,
    category: document.category,
    available: document.available,
    coverSeed: document.coverSeed,
    synopsis: document.synopsis,
  };
}

function uniqueById(books: Book[]): Book[] {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.id)) {
      return false;
    }

    seen.add(book.id);
    return true;
  });
}

function filterMockBooks(category?: string | null): Book[] {
  if (!category) {
    return mockBooks;
  }

  return mockBooks.filter((book) => book.category === category);
}

function mergeWithMockBooks(books: Book[], category?: string | null): Book[] {
  const uniqueBooks = uniqueById(books);
  const existingIds = new Set(uniqueBooks.map((book) => book.id));
  const extraBooks = filterMockBooks(category).filter(
    (book) => !existingIds.has(book.id),
  );

  if (extraBooks.length === 0) {
    return uniqueBooks;
  }

  return [...uniqueBooks, ...extraBooks].sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
}

export async function getAllBooks(): Promise<Book[]> {
  return getBooksByCategory(null);
}

export async function getBooksByCategory(
  category?: string | null,
): Promise<Book[]> {
  try {
    const books = await getBooksCollection();
    const query = category ? { category } : {};
    const documents = await books.find(query).sort({ title: 1 }).toArray();
    const filteredBooks = uniqueById(documents.map(toBook));

    if (filteredBooks.length === 0) {
      return filterMockBooks(category);
    }

    const totalBooks = await books.countDocuments();
    if (totalBooks < mockBooks.length) {
      return mergeWithMockBooks(filteredBooks, category);
    }

    return filteredBooks;
  } catch (error) {
    console.warn("MongoDB indisponível, usando livros de exemplo.", error);
    return filterMockBooks(category);
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const allBooks = await getAllBooks();
  return allBooks.slice(0, 5);
}
