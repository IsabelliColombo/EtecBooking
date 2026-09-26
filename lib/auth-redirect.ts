export const DEFAULT_AFTER_LOGIN = "/home";

/** Aceita só caminhos relativos internos (evita open redirect). */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = DEFAULT_AFTER_LOGIN,
): string {
  if (!value) {
    return fallback;
  }

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return fallback;
  }

  if (value === "/login" || value.startsWith("/login?")) {
    return fallback;
  }

  return value;
}

/** Monta `/login?next=...` a partir da página que o usuário tentou acessar. */
export function buildLoginHref(returnPath?: string | null): string {
  const next = getSafeRedirectPath(returnPath, "");
  if (!next) {
    return "/login";
  }

  return `/login?next=${encodeURIComponent(next)}`;
}
