"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  Home,
  LogIn,
  Menu,
  Newspaper,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EtecLogo } from "@/components/layout/etec-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";

export const navItems = [
  { label: "Início", href: "/home", icon: Home },
  { label: "Catálogo", href: "/catalogo", icon: BookOpen },
  { label: "Reserva", href: "/reservas", icon: Bookmark },
  { label: "Novidades", href: "/novidades", icon: Newspaper },
  { label: "Eventos", href: "/eventos", icon: CalendarDays },
  { label: "Meu Perfil", href: "/perfil", icon: User },
] as const;

type UsuarioNav = {
  nome: string;
  matricula: string;
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
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const acaoDesktop = usuario ? (
    <Link
      href="/perfil"
      className={cn(
        "hidden items-center gap-1.5 rounded-button px-3 py-2 text-small font-medium text-white lg:flex",
        "cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:bg-primary-700/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
      )}
    >
      <User className="size-4" aria-hidden />
      {primeiroNome(usuario.nome)}
    </Link>
  ) : (
    <Link
      href="/login"
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
    <NavLink
      label={primeiroNome(usuario.nome)}
      href="/perfil"
      icon={User}
      onClick={closeMenu}
      className="w-full"
    />
  ) : (
    <NavLink
      label="Entrar"
      href="/login"
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
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border bg-surface text-foreground transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
            aria-label="Notificações"
          >
            <Bell className="size-5" aria-hidden />
          </button>
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
