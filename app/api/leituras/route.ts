import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";
import type { ReservationDocument } from "@/lib/db/types";
import { getDatabase } from "@/lib/mongodb";
import { withApiErrors } from "@/lib/api-error";

async function completeReading(request: Request) {
  const aluno = await getCurrentAluno();
  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reservationId =
    typeof body?.reservationId === "string" ? body.reservationId.trim() : "";
  if (!reservationId || reservationId.length > 100) {
    return NextResponse.json({ error: "Reserva inválida." }, { status: 400 });
  }

  const reservations = (await getDatabase()).collection<ReservationDocument>("reservations");
  const ownReservation = await reservations.findOne({
    reservationId,
    userId: aluno.matricula,
  });
  if (!ownReservation) {
    return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
  }
  if (!["active", "returned"].includes(ownReservation.status)) {
    return NextResponse.json(
      { error: "Esta reserva não permite concluir a leitura." },
      { status: 409 },
    );
  }

  if (ownReservation.readingStatus !== "completed") {
    await reservations.updateOne(
      {
        reservationId,
        userId: aluno.matricula,
        status: { $in: ["active", "returned"] },
        readingStatus: { $ne: "completed" },
      },
      {
        $set: {
          readingStatus: "completed",
          readingFinishedAt: new Date(),
        },
      },
    );
  }

  const updatedReservation = await reservations.findOne({
    reservationId,
    userId: aluno.matricula,
  });
  if (updatedReservation?.readingStatus !== "completed") {
    return NextResponse.json(
      { error: "Não foi possível concluir a leitura desta reserva." },
      { status: 409 },
    );
  }

  return NextResponse.json({ readingStatus: "completed" });
}

export const POST = withApiErrors(completeReading);
