import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FeaturedBooksSection } from "@/components/home/featured-books-section";
import { HeroSection } from "@/components/home/hero-section";
import { getFeaturedBooks } from "@/lib/books";
import { requireAluno } from "@/lib/require-aluno";

export default async function HomePage() {
  await requireAluno("/home");
  const books = await getFeaturedBooks();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedBooksSection books={books} />
      <Footer />
    </div>
  );
}
