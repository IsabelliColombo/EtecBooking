import type { Book } from "@/lib/mock-books";

export interface NovidadeItem {
  id: string;
  title: string;
  author: string;
  coverSeed: string;
  category: string;
  genres: string[];
  addedAt: string;
  available: boolean;
  synopsis: string;
}

export const novidadesItems: NovidadeItem[] = [
  {
    id: "nov-1",
    title: "Jogos Vorazes",
    author: "Suzanne Collins",
    coverSeed: "jogos-vorazes",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    addedAt: "2024-05-10",
    available: true,
    synopsis:
      "Em um futuro distópico, Katniss Everdeen é forçada a participar de um cruel jogo televisivo de sobrevivência.",
  },
  {
    id: "nov-2",
    title: "Em Chamas",
    author: "Suzanne Collins",
    coverSeed: "em-chamas",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    addedAt: "2024-05-08",
    available: true,
    synopsis:
      "Katniss torna-se símbolo de resistência e precisa enfrentar novos desafios após vencer os Jogos Vorazes.",
  },
  {
    id: "nov-3",
    title: "Maze Runner: Correr ou Morrer",
    author: "James Dashner",
    coverSeed: "maze-runner",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    addedAt: "2024-05-05",
    available: true,
    synopsis:
      "Thomas acorda em um labirinto sem memórias e precisa descobrir como escapar com outros adolescentes.",
  },
  {
    id: "nov-4",
    title: "Divergente",
    author: "Veronica Roth",
    coverSeed: "divergente",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Romance"],
    addedAt: "2024-05-03",
    available: true,
    synopsis:
      "Tris Prior descobre que não pertence a nenhuma facção em uma sociedade dividida e precisa esconder quem realmente é.",
  },
];

export function novidadeToBook(item: NovidadeItem): Book {
  return {
    id: item.id,
    title: item.title,
    author: item.author,
    category: item.category,
    available: item.available,
    coverSeed: item.coverSeed,
    synopsis: item.synopsis,
  };
}

export function formatNovidadeDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
