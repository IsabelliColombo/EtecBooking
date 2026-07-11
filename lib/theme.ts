export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function applyTheme(theme: Theme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getActiveTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||s==='light'?s:d?'dark':'light';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('light');}})();`;
