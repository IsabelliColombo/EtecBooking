import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NovidadesContent } from "@/components/novidades/novidades-content";

export default function NovidadesPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
          <NovidadesContent />
        </section>
      </main>
      <Footer />
    </div>
  );
}
