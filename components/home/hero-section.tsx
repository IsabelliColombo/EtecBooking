import Image from "next/image";
import { BookOpen, Bookmark, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const quickLinks = [
  {
    icon: BookOpen,
    title: "Catálogo",
    description: "Explore nosso acervo",
    href: "#",
  },
  {
    icon: Calendar,
    title: "Empréstimos",
    description: "Consulte seus empréstimos",
    href: "#",
  },
  {
    icon: Bookmark,
    title: "Reservas",
    description: "Reserve seu próximo livro",
    href: "#",
  },
] as const;

export function HeroSection() {
  return (
    <section className="px-4 pt-6 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-hero">
          <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <div className="relative flex flex-col gap-8 px-6 py-12 md:px-12 md:py-16 lg:py-20">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-h2 font-bold text-white md:text-h1">
                Biblioteca Online ETEC de Araras
              </h1>
              <p className="text-body text-white/90 md:text-lg">
                Conhecimento ao seu alcance. Pesquise, explore e empreste livros
                de onde estiver.
              </p>
            </div>

            <form className="flex w-full max-w-3xl overflow-hidden rounded-input bg-surface shadow-lg">
              <label htmlFor="hero-search" className="sr-only">
                Pesquisar livros
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Pesquise por título, autor ou assunto..."
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-body text-foreground placeholder:text-muted focus:outline-none md:h-14 md:px-6"
              />
              <button
                type="submit"
                className={cn(
                  "flex h-12 w-14 shrink-0 items-center justify-center bg-primary-500 text-white md:h-14 md:w-16",
                  "transition-colors duration-150 hover:bg-primary-600",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2",
                )}
                aria-label="Pesquisar"
              >
                <Search className="size-5" aria-hidden />
              </button>
            </form>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6 lg:gap-10">
              {quickLinks.map(({ icon: Icon, title, description, href }) => (
                <Link
                  key={title}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 text-white",
                    "transition-opacity duration-150 hover:opacity-90",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      "border-2 border-white/80 bg-white/10",
                      "transition-colors duration-150 group-hover:bg-white/20",
                    )}
                    aria-hidden
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-small md:text-body">
                    <strong className="font-semibold">{title}</strong>
                    {" — "}
                    {description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
