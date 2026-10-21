import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EventosContent } from "@/components/eventos/eventos-content";
import { requireAluno } from "@/lib/require-aluno";

export default async function EventosPage() {
  await requireAluno("/eventos");

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
          <EventosContent />
        </section>
      </main>
      <Footer />
    </div>
  );
}
