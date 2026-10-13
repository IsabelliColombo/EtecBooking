import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { BookOpen, CalendarDays, Heart, Star, UserRound } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentAluno } from "@/lib/auth";
import { buildLoginHref } from "@/lib/auth-redirect";
import type { BookDocument, ReservationDocument } from "@/lib/db/types";
import { getDatabase } from "@/lib/mongodb";

type FavoriteDocument = {
  userId: string;
  bookId: string;
  bookTitle?: string;
  createdAt?: Date;
};

type ReviewDocument = {
  userId: string;
  bookId: string;
  bookTitle?: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
};

const statusLabels: Record<ReservationDocument["status"], string> = {
  pending: "Pendente",
  active: "Em andamento",
  returned: "Devolvido",
  cancelled: "Cancelado",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    redirect(buildLoginHref("/perfil"));
  }

  const database = await getDatabase();
  const [reservations, favorites, reviews] = await Promise.all([
    database
      .collection<ReservationDocument>("reservations")
      .find({ userId: aluno.matricula })
      .sort({ reservedAt: -1 })
      .limit(50)
      .toArray(),
    database
      .collection<FavoriteDocument>("favoritos")
      .find({ userId: aluno.matricula })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray(),
    database
      .collection<ReviewDocument>("avaliacoes")
      .find({ userId: aluno.matricula })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray(),
  ]);

  const objectBookIds = reservations.flatMap((reservation) =>
    ObjectId.isValid(reservation.bookId) && reservation.bookId.length === 24
      ? [new ObjectId(reservation.bookId)]
      : [],
  );
  const catalogBookIds = [
    ...new Set(
      reservations.flatMap((reservation) => [
        ...(reservation.catalogBookId ? [reservation.catalogBookId] : []),
        ...(ObjectId.isValid(reservation.bookId) && reservation.bookId.length === 24
          ? []
          : [reservation.bookId]),
      ]),
    ),
  ];
  const bookClauses = [
    ...(objectBookIds.length > 0 ? [{ _id: { $in: objectBookIds } }] : []),
    ...(catalogBookIds.length > 0 ? [{ id: { $in: catalogBookIds } }] : []),
  ];
  const relatedBooks = bookClauses.length
    ? await database
        .collection<BookDocument>("books")
        .find({ $or: bookClauses }, { projection: { _id: 1, id: 1, title: 1 } })
        .toArray()
    : [];
  const titleByMongoId = new Map(
    relatedBooks.map((book) => [book._id.toHexString(), book.title]),
  );
  const titleByCatalogId = new Map(
    relatedBooks.map((book) => [book.id, book.title]),
  );
  const reservationHistory = reservations.map((reservation) => {
    const isObjectId =
      ObjectId.isValid(reservation.bookId) && reservation.bookId.length === 24;
    const titleFromBook = isObjectId
      ? titleByMongoId.get(reservation.bookId)
      : titleByCatalogId.get(reservation.bookId);

    return {
      ...reservation,
      displayBookTitle:
        reservation.bookTitle?.trim() ||
        titleFromBook ||
        (reservation.catalogBookId
          ? titleByCatalogId.get(reservation.catalogBookId)
          : undefined) ||
        "Livro não encontrado no acervo",
    };
  });

  const initials = aluno.nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("pt-BR"))
    .join("");

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="container mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6">
          <header className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-700">
              Minha conta
            </p>
            <h1 className="text-3xl font-semibold text-foreground">Perfil do aluno</h1>
          </header>

          <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary-600 text-2xl font-semibold text-white">
              {initials || <UserRound className="size-8" aria-hidden />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-semibold text-foreground">{aluno.nome}</h2>
              <p className="mt-1 text-body text-muted">RM {aluno.matricula}</p>
              <p className="text-body text-muted">{aluno.curso}</p>
              <p className="text-small text-muted">{aluno.email}</p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 rounded-button bg-primary-600 px-4 py-3 text-small font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
            >
              <BookOpen className="size-4" aria-hidden />
              Explorar livros
            </Link>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Heart className="size-5 text-primary-600" aria-hidden />
                <h2 className="text-xl font-semibold text-foreground">Meus favoritos</h2>
                <span className="ml-auto rounded-full bg-surface-2 px-3 py-1 text-small text-muted">
                  {favorites.length}
                </span>
              </div>
              {favorites.length === 0 ? (
                <p className="text-small text-muted">
                  Você ainda não tem livros favoritos.
                </p>
              ) : (
                <ul className="space-y-3">
                  {favorites.map((favorite) => (
                    <li
                      key={favorite._id.toHexString()}
                      className="rounded-card border border-border p-4"
                    >
                      <p className="font-medium text-foreground">
                        {favorite.bookTitle ?? "Livro salvo"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Star className="size-5 text-primary-600" aria-hidden />
                <h2 className="text-xl font-semibold text-foreground">Minhas avaliações</h2>
                <span className="ml-auto rounded-full bg-surface-2 px-3 py-1 text-small text-muted">
                  {reviews.length}
                </span>
              </div>
              {reviews.length === 0 ? (
                <p className="text-small text-muted">
                  Você ainda não avaliou nenhum livro.
                </p>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((review) => (
                    <li
                      key={review._id.toHexString()}
                      className="rounded-card border border-border p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-foreground">
                          {review.bookTitle ?? "Livro avaliado"}
                        </p>
                        <span className="shrink-0 text-small font-medium text-primary-700">
                          {review.rating}/5 ★
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-small text-muted">{review.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays className="size-5 text-primary-600" aria-hidden />
              <h2 className="text-xl font-semibold text-foreground">
                Histórico de reservas
              </h2>
              <span className="ml-auto rounded-full bg-surface-2 px-3 py-1 text-small text-muted">
                {reservations.length}
              </span>
            </div>
            {reservations.length === 0 ? (
              <div className="rounded-card border border-dashed border-border p-6 text-center">
                <p className="text-small text-muted">Você ainda não fez reservas.</p>
                <Link
                  href="/reservas"
                  className="mt-3 inline-flex text-small font-medium text-primary-700 hover:underline"
                >
                  Procurar um livro
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {reservationHistory.map((reservation) => (
                  <li
                    key={reservation._id.toHexString()}
                    className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {reservation.displayBookTitle}
                      </p>
                      <p className="text-small text-muted">
                        Reservado em {formatDate(reservation.reservedAt)} ·
                        Devolver até {formatDate(reservation.dueDate)}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-surface-2 px-3 py-1 text-small text-muted">
                      {statusLabels[reservation.status] ?? "Reserva"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
