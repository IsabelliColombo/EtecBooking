"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  Home,
  LogIn,
  LogOut,
  Menu,
  Newspaper,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EtecLogo } from "@/components/layout/etec-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buildLoginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/cn";

export const navItems = [
  { label: "Início", href: "/home", icon: Home },
  { label: "Catálogo", href: "/catalogo", icon: BookOpen },
  { label: "Reserva", href: "/reservas", icon: Bookmark },
  { label: "Novidades", href: "/novidades", icon: Newspaper },
  { label: "Eventos", href: "/eventos", icon: CalendarDays },
] as const;

type UsuarioNav = {
  nome: string;
  matricula: string;
};

type NotificacaoNav = {
  id: string;
  bookId: string;
  bookTitle: string;
  status: "unread" | "read";
  notifiedAt: string | null;
};

function NavLink({
  label,
  href,
  icon: Icon,
  active,
  onClick,
  className,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-button px-3 py-2.5 text-small font-medium text-white",
        "cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:bg-primary-700/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        active && "bg-primary-700/40",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0] || nome;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioNav | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificacaoNav[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      try {
        const resposta = await fetch("/api/me");
        if (!resposta.ok) {
          if (ativo) setUsuario(null);
          return;
        }

        const dados = await resposta.json();
        if (ativo && typeof dados?.nome === "string") {
          setUsuario({
            nome: dados.nome,
            matricula: String(dados.matricula ?? ""),
          });
        }
      } catch {
        if (ativo) setUsuario(null);
      }
    }

    void carregarSessao();
    return () => {
      ativo = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!usuario) return;

    let ativo = true;
    let carregando = false;

    async function carregarNotificacoes() {
      if (carregando) return;
      carregando = true;

      try {
        const resposta = await fetch("/api/notificacoes", { cache: "no-store" });
        if (!resposta.ok) return;

        const dados = await resposta.json();
        if (!ativo) return;

        if (Array.isArray(dados.notifications)) {
          setNotifications(
            dados.notifications.filter(
              (item: NotificacaoNav) =>
                typeof item.id === "string" &&
                typeof item.bookId === "string" &&
                typeof item.bookTitle === "string" &&
                (item.status === "unread" || item.status === "read"),
            ),
          );
        }
        setUnreadNotificationCount(
          Number.isFinite(dados.unreadCount) ? dados.unreadCount : 0,
        );
      } catch {
        // Mantém as notificações já carregadas se houver uma falha temporária.
      } finally {
        carregando = false;
      }
    }

    function atualizarSeVisivel() {
      if (document.visibilityState === "visible") {
        void carregarNotificacoes();
      }
    }

    void carregarNotificacoes();
    const intervalo = window.setInterval(atualizarSeVisivel, 30_000);
    document.addEventListener("visibilitychange", atualizarSeVisivel);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", atualizarSeVisivel);
    };
  }, [usuario]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleResize() {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    }

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const loginHref = buildLoginHref(pathname);

  async function sair() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      setUsuario(null);
      setNotifications([]);
      setUnreadNotificationCount(0);
      setNotificationsOpen(false);
      setOpen(false);
      window.location.assign("/login");
    }
  }

  async function abrirNotificacao(notificacao: NotificacaoNav) {
    if (notificacao.status === "unread") {
      try {
        const resposta = await fetch("/api/notificacoes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: notificacao.id }),
        });

        if (resposta.ok) {
          setNotifications((atuais) =>
            atuais.map((item) =>
              item.id === notificacao.id ? { ...item, status: "read" } : item,
            ),
          );
          setUnreadNotificationCount((atual) => Math.max(0, atual - 1));
        }
      } catch {
        // A navegação ainda funciona mesmo se não for possível marcar como lida.
      }
    }

    setNotificationsOpen(false);
    router.push(`/reservas?bookId=${encodeURIComponent(notificacao.bookId)}`);
  }

  const acaoDesktop = usuario ? (
    <div className="hidden items-center gap-1 lg:flex">
      <Link
        href="/perfil"
        className="flex items-center gap-1.5 rounded-button px-3 py-2 text-small font-medium text-white transition-colors hover:bg-primary-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <UserRound className="size-4" aria-hidden />
        {primeiroNome(usuario.nome)}
      </Link>
      <button
        type="button"
        onClick={sair}
        className="flex items-center gap-1.5 rounded-button px-3 py-2 text-small font-medium text-white transition-colors hover:bg-primary-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <LogOut className="size-4" aria-hidden />
        Sair
      </button>
    </div>
  ) : (
    <Link
      href={loginHref}
      className={cn(
        "hidden items-center gap-1.5 rounded-button px-3 py-2 text-small font-medium text-white lg:flex",
        "cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:bg-primary-700/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
      )}
    >
      <LogIn className="size-4" aria-hidden />
      Entrar
    </Link>
  );

  const acaoMobile = usuario ? (
    <div className="flex flex-col gap-1">
      <Link
        href="/perfil"
        onClick={closeMenu}
        className="flex items-center gap-2 rounded-button px-3 py-2.5 text-small font-medium text-white transition-colors hover:bg-primary-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <UserRound className="size-4 shrink-0" aria-hidden />
        {primeiroNome(usuario.nome)}
      </Link>
      <button
        type="button"
        onClick={sair}
        className="flex w-full items-center gap-2 rounded-button px-3 py-2.5 text-left text-small font-medium text-white transition-colors hover:bg-primary-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Sair
      </button>
    </div>
  ) : (
    <NavLink
      label="Entrar"
      href={loginHref}
      icon={LogIn}
      onClick={closeMenu}
      className="w-full"
    />
  );

  return (
    <header className="relative z-40 bg-surface">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <EtecLogo />
        <div className="flex items-center gap-3">
          {usuario && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((atual) => !atual)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-button border border-border bg-surface text-foreground transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                aria-label={
                  unreadNotificationCount > 0
                    ? `Notificações, ${unreadNotificationCount} não lidas`
                    : "Notificações"
                }
                aria-expanded={notificationsOpen}
                aria-controls="student-notifications"
              >
                <Bell className="size-5" aria-hidden />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <section
                  id="student-notifications"
                  aria-label="Notificações do aluno"
                  className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-card border border-border bg-surface shadow-lg"
                >
                  <div className="border-b border-border px-4 py-3">
                    <h2 className="font-semibold text-foreground">Notificações</h2>
                    <p className="text-xs text-muted">
                      Avisos de disponibilidade dos livros
                    </p>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="px-4 py-5 text-small text-muted">
                      Nenhuma notificação por enquanto.
                    </p>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto">
                      {notifications.map((notificacao) => (
                        <li key={notificacao.id} className="border-b border-border last:border-b-0">
                          <button
                            type="button"
                            onClick={() => void abrirNotificacao(notificacao)}
                            className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40"
                          >
                            <span
                              className={`mt-1.5 size-2 shrink-0 rounded-full ${
                                notificacao.status === "unread" ? "bg-primary-600" : "bg-border"
                              }`}
                              aria-hidden
                            />
                            <span>
                              <span className="block text-small font-medium text-foreground">
                                {notificacao.bookTitle} está disponível.
                              </span>
                              <span className="mt-1 block text-xs text-muted">
                                Toque para consultar e tentar reservar.
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="border-t border-border px-4 py-2 text-xs text-muted">
                    O aviso não reserva o livro automaticamente.
                  </p>
                </section>
              )}
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>

      <nav
        className="relative bg-primary-600"
        aria-label="Navegação principal"
      >
        <div className="container mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-6">
          <ul className="hidden items-center gap-1 lg:flex lg:gap-2">
            {navItems.map(({ label, href, icon }) => (
              <li key={label}>
                <NavLink
                  label={label}
                  href={href}
                  icon={icon}
                  active={pathname === href}
                />
              </li>
            ))}
          </ul>

          {acaoDesktop}

          <button
            type="button"
            className={cn(
              "ml-auto flex size-11 items-center justify-center rounded-button text-white lg:hidden",
              "cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:bg-primary-700/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            )}
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? (
              <X className="size-6" aria-hidden />
            ) : (
              <Menu className="size-6" aria-hidden />
            )}
          </button>
        </div>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={closeMenu}
            aria-label="Fechar menu"
          />
        )}

        <div
          id="mobile-menu"
          className={cn(
            "absolute top-full right-0 left-0 z-50 overflow-hidden border-t border-primary-700 bg-primary-600 shadow-lg lg:hidden",
            "transition-all duration-150 ease-in-out",
            open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
          )}
        >
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navItems.map(({ label, href, icon }) => (
              <li key={label}>
                <NavLink
                  label={label}
                  href={href}
                  icon={icon}
                  active={pathname === href}
                  onClick={closeMenu}
                  className="w-full"
                />
              </li>
            ))}
          </ul>

          <div className="border-t border-primary-700 px-4 py-4">{acaoMobile}</div>
        </div>
      </nav>
    </header>
  );
}
