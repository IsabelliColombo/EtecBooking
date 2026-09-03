"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

const profile = {
  name: "João Pedro Silva",
  rm: "12345678",
  course: "Desenvolvimento de Sistemas - 2º Módulo",
  photo: "https://picsum.photos/seed/perfil/240/240",
  borrowedCount: 2,
  reviewsCount: 5,
  favoritesCount: 3,
};

const historyItems = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    status: "Devolvido",
    date: "25/05/2024",
  },
  {
    title: "1984",
    author: "George Orwell",
    status: "Devolvido",
    date: "10/05/2024",
  },
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    status: "Devolvido",
    date: "28/04/2024",
  },
  {
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    status: "Em andamento",
    date: "Devolver até: 20/06/2024",
  },
];

const reviewItems = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    date: "25/05/2024",
    rating: 4,
  },
  {
    title: "1984",
    author: "George Orwell",
    date: "10/05/2024",
    rating: 4,
  },
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    date: "28/04/2024",
    rating: 5,
  },
];

const favoriteItems = [
  {
    title: "Jogos Vorazes",
    author: "Suzanne Collins",
    date: "12/05/2024",
  },
  {
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    date: "02/05/2024",
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    date: "18/04/2024",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={index < rating ? "size-4 fill-current" : "size-4 text-muted"}
          aria-hidden
        />
      ))}
    </div>
  );
}

type ProfileTab = "history" | "reviews" | "favorites";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("history");

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-8 rounded-card border border-border bg-surface p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
              <div className="flex items-center gap-4 rounded-card border border-border bg-background p-4 shadow-sm">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-surface-2">
                  <Image
                    src={profile.photo}
                    alt={`Foto de ${profile.name}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-primary-700">Meu Perfil</p>
                  <h1 className="text-2xl font-semibold text-foreground">{profile.name}</h1>
                  <p className="text-body text-muted">RM: {profile.rm}</p>
                  <p className="mt-2 text-small font-medium text-foreground">{profile.course}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                  <p className="text-small text-muted">Livros emprestados</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{profile.borrowedCount}</p>
                </div>
                <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                  <p className="text-small text-muted">Avaliações feitas</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{profile.reviewsCount}</p>
                </div>
                <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                  <p className="text-small text-muted">Favoritos</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{profile.favoritesCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface shadow-sm">
            <div className="flex flex-col border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`rounded-button px-4 py-2 text-small font-medium transition-colors duration-150 ${
                    activeTab === "history"
                      ? "bg-primary-600 text-white"
                      : "bg-background text-foreground hover:bg-surface-2"
                  }`}
                >
                  Histórico de pedidos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`rounded-button px-4 py-2 text-small font-medium transition-colors duration-150 ${
                    activeTab === "reviews"
                      ? "bg-primary-600 text-white"
                      : "bg-background text-foreground hover:bg-surface-2"
                  }`}
                >
                  Minhas avaliações
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("favorites")}
                  className={`rounded-button px-4 py-2 text-small font-medium transition-colors duration-150 ${
                    activeTab === "favorites"
                      ? "bg-primary-600 text-white"
                      : "bg-background text-foreground hover:bg-surface-2"
                  }`}
                >
                  Favoritos
                </button>
              </div>
             
            </div>

            {activeTab === "history" ? (
              <div className="space-y-4 p-4">
                {historyItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-body font-semibold text-foreground">{item.title}</p>
                      <p className="text-small text-muted">{item.author}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-small text-muted sm:items-end">
                      <span className="inline-flex rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-foreground">
                        {item.status}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <ChevronRight className="size-5 text-muted" aria-hidden />
                  </div>
                ))}
              </div>
            ) : activeTab === "reviews" ? (
              <div className="space-y-4 p-4">
                {reviewItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-body font-semibold text-foreground">{item.title}</p>
                      <p className="text-small text-muted">{item.author}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <StarRating rating={item.rating} />
                      <p className="text-small text-muted">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {favoriteItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-body font-semibold text-foreground">{item.title}</p>
                      <p className="text-small text-muted">{item.author}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-small text-muted sm:items-end">
                      <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        Favorito
                      </span>
                      <span>Adicionado em {item.date}</span>
                    </div>
                    <ChevronRight className="size-5 text-muted" aria-hidden />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
