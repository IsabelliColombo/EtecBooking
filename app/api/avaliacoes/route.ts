import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import type { ReservationDocument } from "@/lib/db/types";
import { withApiErrors } from "@/lib/api-error";

type ReviewDocument = {
  userId: string;
  reservationId: string;
  bookId: string;
  bookTitle: string;
  rating: number;
  comment?: string;
  createdAt: Date;
};

async function createReview(request: Request) {
  const aluno = await getCurrentAluno();
  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reservationId =
    typeof body?.reservationId === "string" ? body.reservationId.trim() : "";
  const rating = Number(body?.rating);
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";
  if (
    !reservationId ||
    reservationId.length > 100 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    comment.length > 500
  ) {
    return NextResponse.json({ error: "Confira a nota e o comentário." }, { status: 400 });
  }

  const database = await getDatabase();
  const reservation = await database
    .collection<ReservationDocument>("reservations")
    .findOne({ reservationId, userId: aluno.matricula });
  if (!reservation) {
    return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
  }
  if (reservation.readingStatus !== "completed") {
    return NextResponse.json(
      { error: "Marque a leitura como concluída antes de avaliar este livro." },
      { status: 409 },
    );
  }

  const bookId = reservation.catalogBookId?.trim() || reservation.bookId;
  const bookTitle = reservation.bookTitle?.trim() || "Livro avaliado";
  const reviews = database.collection<ReviewDocument & { _id: string }>("avaliacoes");
  const existingReview = await reviews.findOne({ userId: aluno.matricula, bookId });
  if (existingReview) {
    return NextResponse.json({ error: "Você já avaliou este livro." }, { status: 409 });
  }

  try {
    await reviews.insertOne({
      _id: `${aluno.matricula}:${bookId}`,
      userId: aluno.matricula,
      reservationId,
      bookId,
      bookTitle,
      rating,
      ...(comment ? { comment } : {}),
      createdAt: new Date(),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({ error: "Você já avaliou este livro." }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.json({ review: { bookId, bookTitle, rating, comment } }, { status: 201 });
}

export const POST = withApiErrors(createReview);
