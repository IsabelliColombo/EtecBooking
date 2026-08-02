import { Suspense } from "react";
import Image from "next/image";
import { BookOpen, Heart, Search } from "lucide-react";
import { CategoryFilter } from "@/components/catalogo/category-filter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { getBooksByCategory } from "@/lib/books";
import { getBookCoverUrl, type Book } from "@/lib/mock-books";

function CatalogBookCard({ book }: { book: Book }) {
  const availabilityLabel = book.available ? "Disponível" : "Emprestado";
  const demandLabel = book.available ? "Alta" : "Média";

  return (
    <article className="group overflow-hidden rounded-card border border-border bg-surface shadow-sm transition-shadow duration-150 hover:shadow-md">
      <div className="relative overflow-hidden bg-surface-2">
        <div className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors duration-150 group-hover:bg-primary-50">
          <Heart className="size-4 text-muted" aria-hidden />
        </div>
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={getBookCoverUrl(book.coverSeed)}
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-body font-semibold text-foreground">
            {book.title}
          </h3>
          <p className="text-small text-muted">{book.author}</p>
        </div>

        <span className="inline-flex rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary-700">
          {book.category}
        </span>

        <div className="grid gap-3 text-small text-muted sm:grid-cols-2">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Disponibilidade</p>
            <p className="flex items-center gap-2">
              <span
                className={`size-2 inline-block rounded-full ${book.available ? "bg-success" : "bg-warning"}`}
                aria-hidden
              />
              {availabilityLabel}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-foreground">Demanda</p>
            <p className="flex items-center gap-2 text-error">{demandLabel}</p>
          </div>
        </div>

        <button
          type="button"
          className="mt-auto inline-flex h-11 items-center justify-center rounded-button border border-border bg-primary-600 px-4 text-body font-medium text-white transition-colors duration-150 hover:bg-primary-700"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}

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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {books.map((book) => (
                <CatalogBookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
