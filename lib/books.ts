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

export async function getFeaturedBooks(): Promise<Book[]> {
  try {
    const books = await getBooksCollection();
    const documents = await books.find().sort({ title: 1 }).toArray();

    return documents.map(toBook);
  } catch (error) {
    console.warn("MongoDB indisponível, usando livros de exemplo.", error);
    return mockBooks;
  }
}
