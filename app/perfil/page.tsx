"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { ProfileRecord } from "@/lib/profile";

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

function EmptyState({ message }: { message: string }) {
  return (
    <p className="p-6 text-center text-small text-muted">{message}</p>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("history");
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const resposta = await fetch("/api/perfil");

        if (resposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) {
          throw new Error(dados?.error ?? "Não foi possível carregar o perfil.");
        }

        if (ativo) {
          setProfile(dados as ProfileRecord);
          setError(null);
        }
      } catch (requestError) {
        if (ativo) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o perfil.",
          );
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    void carregarPerfil();
    return () => {
      ativo = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
          {loading ? (
            <p className="text-body text-muted">Carregando perfil...</p>
          ) : error ? (
            <p role="alert" className="text-body text-red-600">
              {error}
            </p>
          ) : profile ? (
            <>
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
                      <p className="text-sm uppercase tracking-[0.2em] text-primary-700">
                        Meu Perfil
                      </p>
                      <h1 className="text-2xl font-semibold text-foreground">
                        {profile.name}
                      </h1>
                      <p className="text-body text-muted">RM: {profile.rm}</p>
                      <p className="text-small text-muted">{profile.email}</p>
                      <p className="mt-2 text-small font-medium text-foreground">
                        {profile.course}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                      <p className="text-small text-muted">Livros emprestados</p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">
                        {profile.borrowedCount}
                      </p>
                    </div>
                    <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                      <p className="text-small text-muted">Avaliações feitas</p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">
                        {profile.reviewsCount}
                      </p>
                    </div>
                    <div className="rounded-card border border-border bg-surface p-4 shadow-sm">
                      <p className="text-small text-muted">Favoritos</p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">
                        {profile.favoritesCount}
                      </p>
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
                  profile.historyItems.length === 0 ? (
                    <EmptyState message="Nenhum pedido no histórico ainda." />
                  ) : (
                    <div className="space-y-4 p-4">
                      {profile.historyItems.map((item) => (
                        <div
                          key={`${item.title}-${item.date}`}
                          className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-body font-semibold text-foreground">
                              {item.title}
                            </p>
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
                  )
                ) : activeTab === "reviews" ? (
                  profile.reviewItems.length === 0 ? (
                    <EmptyState message="Você ainda não fez avaliações." />
                  ) : (
                    <div className="space-y-4 p-4">
                      {profile.reviewItems.map((item) => (
                        <div
                          key={`${item.title}-${item.date}`}
                          className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-body font-semibold text-foreground">
                              {item.title}
                            </p>
                            <p className="text-small text-muted">{item.author}</p>
                          </div>
                          <div className="flex flex-col gap-2 text-right">
                            <StarRating rating={item.rating} />
                            <p className="text-small text-muted">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : profile.favoriteItems.length === 0 ? (
                  <EmptyState message="Nenhum favorito salvo ainda." />
                ) : (
                  <div className="space-y-4 p-4">
                    {profile.favoriteItems.map((item) => (
                      <div
                        key={`${item.title}-${item.date}`}
                        className="flex flex-col gap-3 rounded-card border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-body font-semibold text-foreground">
                            {item.title}
                          </p>
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
            </>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
}
