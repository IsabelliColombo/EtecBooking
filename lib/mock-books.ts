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
    category: "Ficção",
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
];

export function getBookCoverUrl(
  coverSeed: string,
  width = 300,
  height = 400,
) {
  return `https://picsum.photos/seed/${coverSeed}/${width}/${height}`;
}
