import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ReservationForm } from "@/components/reservas/reservation-form";
import { requireAluno } from "@/lib/require-aluno";

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookId?: string | string[] }>;
}) {
  const aluno = await requireAluno("/reservas");

  const params = await searchParams;
  const bookId = typeof params.bookId === "string" ? params.bookId : "";

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
          <ReservationForm
            aluno={{
              nome: aluno.nome,
              matricula: aluno.matricula,
              curso: aluno.curso,
            }}
            initialBookId={bookId}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
