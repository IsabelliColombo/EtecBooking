import type { BookDocument } from "@/lib/db/types";
import { getBooksCollection } from "@/lib/mongodb";
import type { Book } from "@/lib/mock-books";

function toBook(document: BookDocument): Book {
  return {
    id: document.id,
    databaseId: document._id.toHexString(),
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

export async function getAllBooks(): Promise<Book[]> {
  return getBooksByCategory(null);
}

export async function getBooksByCategory(
  category?: string | null,
): Promise<Book[]> {
  const books = await getBooksCollection();
  const query = category ? { category } : {};
  const documents = await books.find(query).sort({ title: 1 }).toArray();
  return uniqueById(documents.map(toBook));
}

export async function getBookCategories(): Promise<string[]> {
  const books = await getBooksCollection();
  const categories = await books.distinct("category");

  return categories
    .filter((category): category is string => typeof category === "string")
    .sort((first, second) => first.localeCompare(second, "pt-BR"));
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const allBooks = await getAllBooks();
  return allBooks.slice(0, 5);
}
