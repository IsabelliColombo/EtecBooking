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

export async function getAllBooks(): Promise<Book[]> {
  try {
    const books = await getBooksCollection();
    const documents = await books.find().sort({ title: 1 }).toArray();
    const allBooks = documents.map(toBook);

    if (allBooks.length === 0) {
      return mockBooks;
    }

    if (allBooks.length < mockBooks.length) {
      const existingIds = new Set(allBooks.map((book) => book.id));
      const extraBooks = mockBooks.filter((book) => !existingIds.has(book.id));
      return [...allBooks, ...extraBooks];
    }

    return allBooks;
  } catch (error) {
    console.warn("MongoDB indisponível, usando livros de exemplo.", error);
    return mockBooks;
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const allBooks = await getAllBooks();
  return allBooks.slice(0, 5);
}
