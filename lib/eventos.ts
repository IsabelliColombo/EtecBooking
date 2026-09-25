export type Evento = {
  id: string;
  title: string;
  year: string;
  category: string;
  imageUrl: string;
  description: string;
  dateLabel: string;
  location: string;
};

export const eventosItems: Evento[] = [
  {
    id: "clube-leitura",
    title: "Clube de Leitura",
    year: "2026",
    category: "Literatura",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    description:
      "Encontros mensais para discutir obras clássicas e contemporâneas com a comunidade da biblioteca.",
    dateLabel: "Toda terceira quinta-feira do mês",
    location: "Sala de leitura — Biblioteca ETEC",
  },
  {
    id: "palestra-tecnologia",
    title: "Palestra sobre Tecnologia",
    year: "2026",
    category: "TI",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description:
      "Palestra sobre tendências em tecnologia, inovação e mercado de trabalho na área de TI.",
    dateLabel: "15 de abril de 2026",
    location: "Auditório — Biblioteca ETEC",
  },
  {
    id: "oficina-escrita",
    title: "Oficina de Escrita",
    year: "2026",
    category: "Literatura",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    description:
      "Oficina prática de escrita criativa e produção textual para alunos de todos os cursos.",
    dateLabel: "22 de maio de 2026",
    location: "Sala multiuso — Biblioteca ETEC",
  },
  {
    id: "feira-livros",
    title: "Feira de Livros",
    year: "2026",
    category: "Evento",
    imageUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80",
    description:
      "Feira com exposições, trocas e indicação de livros novos e usados da biblioteca.",
    dateLabel: "10 a 12 de junho de 2026",
    location: "Pátio da biblioteca",
  },
];
