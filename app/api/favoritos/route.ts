import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";
import type { BookDocument } from "@/lib/db/types";
import { getDatabase } from "@/lib/mongodb";

type FavoriteDocument = {
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  createdAt: Date;
};

export async function GET() {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const database = await getDatabase();
  const favorites = await database
    .collection<FavoriteDocument>("favoritos")
    .find({ userId: aluno.matricula }, { projection: { bookId: 1, _id: 0 } })
    .toArray();

  return NextResponse.json(
    { bookIds: favorites.map((favorite) => favorite.bookId) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";
  const favorite = body?.favorite;

  if (!ObjectId.isValid(bookId) || bookId.length !== 24) {
    return NextResponse.json({ error: "Livro inválido." }, { status: 400 });
  }

  if (typeof favorite !== "boolean") {
    return NextResponse.json({ error: "Estado do favorito inválido." }, { status: 400 });
  }

  const database = await getDatabase();
  const book = await database
    .collection<BookDocument>("books")
    .findOne({ _id: new ObjectId(bookId) });

  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  const favorites = database.collection<FavoriteDocument>("favoritos");

  if (favorite) {
    await favorites.updateOne(
      { userId: aluno.matricula, bookId },
      {
        $setOnInsert: {
          userId: aluno.matricula,
          bookId,
          bookTitle: book.title,
          bookAuthor: book.author,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  } else {
    await favorites.deleteOne({ userId: aluno.matricula, bookId });
  }

  return NextResponse.json({ bookId, favorite });
}
