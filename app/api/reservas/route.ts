import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";
import type { BookDocument, ReservationDocument } from "@/lib/db/types";
import { getDatabase } from "@/lib/mongodb";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const url = new URL(request.url);
  const bookId = url.searchParams.get("bookId")?.trim();
  const search = url.searchParams.get("busca")?.trim();

  if (bookId) {
    const database = await getDatabase();
    const bookQuery =
      ObjectId.isValid(bookId) && bookId.length === 24
        ? { _id: new ObjectId(bookId) }
        : { id: bookId };
    const book = await database
      .collection<BookDocument>("books")
      .find(bookQuery)
      .sort({ available: -1 })
      .limit(1)
      .next();

    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      book: {
        id: book._id.toHexString(),
        title: book.title,
        author: book.author,
        available: book.available === true,
      },
    });
  }

  if (!search || search.length > 100) {
    return NextResponse.json({ books: [] });
  }

  const pattern = escapeRegex(search);
  const database = await getDatabase();
  const bookDocuments = await database
    .collection<BookDocument>("books")
    .find(
      {
        $or: [
          { title: { $regex: pattern, $options: "i" } },
          { author: { $regex: pattern, $options: "i" } },
        ],
      },
      { projection: { id: 1, title: 1, author: 1, available: 1 } },
    )
    .sort({ id: 1, available: -1, title: 1 })
    .toArray();

  const booksByCatalogId = new Map<string, (typeof bookDocuments)[number]>();
  for (const book of bookDocuments) {
    if (!booksByCatalogId.has(book.id)) {
      booksByCatalogId.set(book.id, book);
    }
  }

  return NextResponse.json({
    books: [...booksByCatalogId.values()]
      .sort((left, right) => left.title.localeCompare(right.title, "pt-BR"))
      .slice(0, 25)
      .map((book) => ({
        id: book._id.toHexString(),
        title: book.title,
        author: book.author,
        available: book.available === true,
      })),
  });
}

export async function POST(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";

  if (!ObjectId.isValid(bookId) || bookId.length !== 24) {
    return NextResponse.json({ error: "Livro inválido." }, { status: 400 });
  }

  const database = await getDatabase();
  const books = database.collection<BookDocument>("books");
  const reservationId = randomUUID();
  const now = new Date();
  const dueDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

  const book = await books.findOneAndUpdate(
    { _id: new ObjectId(bookId), available: true },
    {
      $set: {
        available: false,
        activeReservationId: reservationId,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );

  if (!book) {
    const existingBook = await books.findOne(
      { _id: new ObjectId(bookId) },
      { projection: { _id: 1 } },
    );

    if (!existingBook) {
      return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "LIVRO NÃO DISPONÍVEL" },
      { status: 409 },
    );
  }

  const reservation: ReservationDocument = {
    reservationId,
    bookId: book._id.toHexString(),
    catalogBookId: book.id,
    bookTitle: book.title,
    bookAuthor: book.author,
    userId: aluno.matricula,
    userName: aluno.nome,
    userCourse: aluno.curso,
    status: "active",
    reservedAt: now,
    dueDate,
  };

  try {
    await database.collection<ReservationDocument>("reservations").insertOne(reservation);
  } catch (error) {
    await books.updateOne(
      { _id: book._id, activeReservationId: reservationId },
      {
        $set: { available: true, updatedAt: new Date() },
        $unset: { activeReservationId: "" },
      },
    );
    throw error;
  }

  return NextResponse.json(
    {
      reservation: {
        reservationId,
        bookId: book._id.toHexString(),
        catalogBookId: book.id,
        dueDate: dueDate.toISOString(),
      },
    },
    { status: 201 },
  );
}
