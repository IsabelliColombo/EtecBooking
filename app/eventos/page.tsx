import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EventosContent } from "@/components/eventos/eventos-content";

export default function EventosPage() {
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
