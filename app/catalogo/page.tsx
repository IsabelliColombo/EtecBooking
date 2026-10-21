import { BookOpen } from "lucide-react";
import { CatalogBooks } from "@/components/catalogo/catalog-books";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentAluno } from "@/lib/auth";
import { buildLoginHref } from "@/lib/auth-redirect";
import { getBookCategories, getBooksByCategory } from "@/lib/books";
import { redirect } from "next/navigation";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string | string[] }>;
}) {
  const aluno = await getCurrentAluno();
  if (!aluno) {
    redirect(buildLoginHref("/catalogo"));
  }

  const params = await searchParams;
  const categoriaParam = params.categoria;
  const category =
    typeof categoriaParam === "string" && categoriaParam.length > 0
      ? categoriaParam
      : null;

  const [books, categories] = await Promise.all([
    getBooksByCategory(category),
    getBookCategories(),
  ]);

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

            </div>
          </div>

          <CatalogBooks books={books} categories={categories} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
