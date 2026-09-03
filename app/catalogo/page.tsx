import { Suspense } from "react";
import { BookOpen, Search } from "lucide-react";
import { BooksGrid } from "@/components/books/books-grid";
import { CategoryFilter } from "@/components/catalogo/category-filter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { getBooksByCategory } from "@/lib/books";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string | string[] }>;
}) {
  const params = await searchParams;
  const categoriaParam = params.categoria;
  const category =
    typeof categoriaParam === "string" && categoriaParam.length > 0
      ? categoriaParam
      : null;

  const books = await getBooksByCategory(category);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8 rounded-card border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
                  <BookOpen className="size-4" aria-hidden />
                  Catálogo
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-foreground">Catálogo</h1>
                  <p className="max-w-2xl text-body text-muted">
                    Explore nosso acervo de livros disponíveis.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:w-[52%]">
                <Input
                  label=""
                  icon={Search}
                  placeholder="Buscar livros..."
                  className="h-12"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Suspense
                    fallback={
                      <div className="h-12 rounded-button border border-border bg-surface" />
                    }
                  >
                    <CategoryFilter />
                  </Suspense>
                  <select className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30">
                    <option>Ordenar por: Título</option>
                    <option>Autor</option>
                    <option>Disponibilidade</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-card border border-border bg-surface p-4 shadow-sm">
            <p className="text-body text-foreground">
              <span className="font-semibold text-foreground">{books.length}</span> livros encontrados
            </p>
          </div>

          {books.length === 0 ? (
            <p className="text-body text-muted">
              Nenhum livro encontrado para esta categoria.
            </p>
          ) : (
            <BooksGrid books={books} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
