import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";
import type { BookDocument } from "@/lib/db/types";
import { getDatabase } from "@/lib/mongodb";
import { withApiErrors } from "@/lib/api-error";

type AvailabilityNotificationStatus = "waiting" | "unread" | "read" | "cancelled";

type AvailabilityNotificationDocument = {
  _id: ObjectId;
  userId: string;
  bookId: string;
  bookTitle: string;
  status: AvailabilityNotificationStatus;
  createdAt: Date;
  notifiedAt?: Date;
  readAt?: Date;
  cancelledAt?: Date;
};

function isValidObjectId(value: string): boolean {
  return ObjectId.isValid(value) && value.length === 24;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

async function getNotifications(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const database = await getDatabase();
  const notifications = database.collection<AvailabilityNotificationDocument>("notificacoes");
  const waiting = await notifications
    .find({ userId: aluno.matricula, status: "waiting" })
    .toArray();
  const waitingBookIds = waiting
    .map((notification) => notification.bookId)
    .filter(isValidObjectId);

  if (waitingBookIds.length > 0) {
    const availableBooks = await database
      .collection<BookDocument>("books")
      .find(
        {
          _id: { $in: waitingBookIds.map((bookId) => new ObjectId(bookId)) },
          available: true,
        },
        { projection: { _id: 1 } },
      )
      .toArray();
    const availableIds = new Set(availableBooks.map((book) => book._id.toHexString()));

    await Promise.all(
      waiting
        .filter((notification) => availableIds.has(notification.bookId))
        .map((notification) =>
          notifications.updateOne(
            {
              _id: notification._id,
              userId: aluno.matricula,
              status: "waiting",
            },
            { $set: { status: "unread", notifiedAt: new Date() } },
          ),
        ),
    );
  }

  const url = new URL(request.url);
  const requestedBookId = url.searchParams.get("bookId")?.trim();
  const [items, unreadCount, activeAlert] = await Promise.all([
    notifications
      .find(
        { userId: aluno.matricula, status: { $in: ["unread", "read"] } },
        { projection: { userId: 0 } },
      )
      .sort({ notifiedAt: -1, createdAt: -1 })
      .limit(30)
      .toArray(),
    notifications.countDocuments({ userId: aluno.matricula, status: "unread" }),
    requestedBookId && isValidObjectId(requestedBookId)
      ? notifications.findOne(
          {
            userId: aluno.matricula,
            bookId: requestedBookId,
            status: "waiting",
          },
          { projection: { _id: 1 } },
        )
      : Promise.resolve(null),
  ]);

  return NextResponse.json(
    {
      notifications: items.map((notification) => ({
        id: notification._id.toHexString(),
        bookId: notification.bookId,
        bookTitle: notification.bookTitle,
        status: notification.status,
        notifiedAt: notification.notifiedAt?.toISOString() ?? null,
      })),
      unreadCount,
      isSubscribed: activeAlert !== null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function updateNotificationSubscription(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";
  const action = body?.action;

  if (!isValidObjectId(bookId)) {
    return NextResponse.json({ error: "Livro inválido." }, { status: 400 });
  }

  if (action !== "subscribe" && action !== "cancel") {
    return NextResponse.json({ error: "Ação de notificação inválida." }, { status: 400 });
  }

  const database = await getDatabase();
  const notifications = database.collection<AvailabilityNotificationDocument>("notificacoes");

  if (action === "cancel") {
    await notifications.updateOne(
      { userId: aluno.matricula, bookId, status: "waiting" },
      { $set: { status: "cancelled", cancelledAt: new Date() } },
    );

    return NextResponse.json({ bookId, subscribed: false });
  }

  const book = await database
    .collection<BookDocument>("books")
    .findOne({ _id: new ObjectId(bookId) }, { projection: { title: 1, available: 1 } });

  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  if (book.available) {
    return NextResponse.json(
      {
        error: "Este livro já está disponível. Você já pode reservá-lo.",
        code: "BOOK_AVAILABLE",
      },
      { status: 409 },
    );
  }

  const now = new Date();
  try {
    await notifications.updateOne(
      { userId: aluno.matricula, bookId, status: "waiting" },
      {
        $setOnInsert: {
          userId: aluno.matricula,
          bookId,
          bookTitle: book.title,
          status: "waiting",
          createdAt: now,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
  }

  return NextResponse.json({ bookId, subscribed: true });
}

async function markNotificationRead(request: Request) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const notificationId =
    typeof body?.notificationId === "string" ? body.notificationId.trim() : "";

  if (!isValidObjectId(notificationId)) {
    return NextResponse.json({ error: "Notificação inválida." }, { status: 400 });
  }

  const database = await getDatabase();
  await database
    .collection<AvailabilityNotificationDocument>("notificacoes")
    .updateOne(
      {
        _id: new ObjectId(notificationId),
        userId: aluno.matricula,
        status: "unread",
      },
      { $set: { status: "read", readAt: new Date() } },
    );

  return NextResponse.json({ ok: true });
}

export const GET = withApiErrors(getNotifications);
export const POST = withApiErrors(updateNotificationSubscription);
export const PATCH = withApiErrors(markNotificationRead);
