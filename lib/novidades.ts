import { getDatabase } from "@/lib/mongodb";
import type { Book } from "@/lib/mock-books";
import type { BookDocument } from "@/lib/db/types";

export interface NovidadeItem {
  id: string;
  databaseId: string;
  title: string;
  author: string;
  coverSeed: string;
  category: string;
  genres: string[];
  addedAt: string;
  available: boolean;
  synopsis: string;
}

type NovidadeDocument = BookDocument & {
  genres?: string[];
  addedAt?: Date;
};

export async function getNovidades(): Promise<NovidadeItem[]> {
  try {
    const books = (await getDatabase()).collection<NovidadeDocument>("books");
    const documents = await books
      .find({ addedAt: { $type: "date" } })
      .sort({ addedAt: -1, title: 1 })
      .toArray();

    return documents.flatMap((document) => {
      const novidade = document;
      if (!(novidade.addedAt instanceof Date)) return [];

      return [
        {
          id: novidade.id,
          databaseId: novidade._id.toHexString(),
          title: novidade.title,
          author: novidade.author,
          coverSeed: novidade.coverSeed,
          category: novidade.category,
          genres: novidade.genres ?? [],
          addedAt: novidade.addedAt.toISOString().slice(0, 10),
          available: novidade.available,
          synopsis: novidade.synopsis,
        },
      ];
    });
  } catch (error) {
    console.error("Não foi possível carregar as novidades do MongoDB.", error);
    return [];
  }
}

export function novidadeToBook(item: NovidadeItem): Book {
  return {
    id: item.id,
    databaseId: item.databaseId,
    title: item.title,
    author: item.author,
    coverSeed: item.coverSeed,
    category: item.category,
    available: item.available,
    synopsis: item.synopsis,
  };
}
