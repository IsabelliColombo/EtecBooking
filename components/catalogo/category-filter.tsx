"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATALOG_CATEGORIES } from "@/lib/mock-books";

export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("categoria") ?? "";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const category = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("categoria", category);
    } else {
      params.delete("categoria");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <select
      value={selectedCategory}
      onChange={handleChange}
      aria-label="Filtrar por categoria"
      className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
    >
      <option value="">Todas as categorias</option>
      {CATALOG_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
