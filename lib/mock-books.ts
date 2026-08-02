export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  coverSeed: string;
  synopsis: string;
}

export const mockBooks: Book[] = [
  {
    id: "mock-1",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasia",
    available: true,
    coverSeed: "hobbit",
    synopsis: "Uma jornada épica por terras mágicas e perigosas.",
  },
  {
    id: "mock-2",
    title: "1984",
    author: "George Orwell",
    category: "Ficção Científica",
    available: true,
    coverSeed: "1984",
    synopsis: "Uma distopia clássica sobre vigilância e controle social.",
  },
  {
    id: "mock-3",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    category: "Clássico",
    available: true,
    coverSeed: "dom-casmurro",
    synopsis: "Um romance brasileiro sobre ciúmes, memória e narrativas.",
  },
  {
    id: "mock-4",
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    category: "Estratégia",
    available: true,
    coverSeed: "guerra",
    synopsis: "Princípios atemporais de estratégia e liderança.",
  },
  {
    id: "mock-5",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Infantil",
    available: true,
    coverSeed: "pequeno-principe",
    synopsis: "Uma história poética sobre amizade, amor e imaginação.",
  },
  {
    id: "mock-6",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    category: "Ficção",
    available: true,
    coverSeed: "bichos",
    synopsis: "Uma fábula política sobre poder e corrupção.",
  },
  {
    id: "mock-7",
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    category: "Romance",
    available: false,
    coverSeed: "menina-roubava-livros",
    synopsis: "Um relato emocionante ambientado na Segunda Guerra Mundial.",
  },
  {
    id: "mock-8",
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    category: "Fantasia",
    available: true,
    coverSeed: "harry-potter",
    synopsis: "O início da saga mágica de Harry Potter em Hogwarts.",
  },
  {
    id: "mock-9",
    title: "O Diário de Anne Frank",
    author: "Anne Frank",
    category: "Memórias",
    available: true,
    coverSeed: "anne-frank",
    synopsis: "O diário verdadeiro de uma jovem durante a ocupação nazista.",
  },
  {
    id: "mock-10",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    category: "Realismo Mágico",
    available: false,
    coverSeed: "cem-anos-solidão",
    synopsis: "A saga da família Buendía em uma aldeia encantada.",
  },
  {
    id: "mock-11",
    title: "O Morro dos Ventos Uivantes",
    author: "Emily Brontë",
    category: "Drama",
    available: true,
    coverSeed: "morro-ventos-uivantes",
    synopsis: "Uma história intensa de amor e vingança nas charnecas.",
  },
  {
    id: "mock-12",
    title: "O Sol é para Todos",
    author: "Harper Lee",
    category: "Clássico",
    available: true,
    coverSeed: "sol-e-para-todos",
    synopsis: "Um romance sobre justiça e inocência no sul dos EUA.",
  },
  {
    id: "mock-13",
    title: "Os Quatro Compromissos",
    author: "Don Miguel Ruiz",
    category: "Autoajuda",
    available: true,
    coverSeed: "quatro-compromissos",
    synopsis: "Quatro princípios simples para transformar sua vida.",
  },
  {
    id: "mock-14",
    title: "O Menino do Pijama Listrado",
    author: "John Boyne",
    category: "Histórico",
    available: false,
    coverSeed: "menino-pijama",
    synopsis: "Uma amizade improvável durante a guerra e seus desdobramentos.",
  },
  {
    id: "mock-15",
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    category: "Não-ficção",
    available: true,
    coverSeed: "sapiens",
    synopsis: "Uma jornada sobre a história e o futuro da humanidade.",
  },
  {
    id: "mock-16",
    title: "A Menina que Brincava com Fogo",
    author: "Stieg Larsson",
    category: "Suspense",
    available: true,
    coverSeed: "menina-fogo",
    synopsis: "Um thriller envolvente com segredos e investigações.",
  },
];

export function getBookCoverUrl(
  coverSeed: string,
  width = 300,
  height = 400,
) {
  return `https://picsum.photos/seed/${coverSeed}/${width}/${height}`;
}

export const CATALOG_CATEGORIES = [
  "Ficção",
  "Infantojuvenil",
  "Clássicos",
  "Fantasia",
  "Literatura",
] as const;
