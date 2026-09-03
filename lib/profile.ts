import { getDatabase } from "@/lib/mongodb";

export type ProfileHistoryItem = {
  title: string;
  author: string;
  status: string;
  date: string;
};

export type ProfileReviewItem = {
  title: string;
  author: string;
  date: string;
  rating: number;
};

export type ProfileRecord = {
  name: string;
  rm: string;
  course: string;
  photo: string;
  borrowedCount: number;
  reviewsCount: number;
  historyItems: ProfileHistoryItem[];
  reviewItems: ProfileReviewItem[];
};

const fallbackProfiles: Record<string, ProfileRecord> = {
  "12345": {
    name: "João Pedro Silva",
    rm: "12345",
    course: "Desenvolvimento de Sistemas - 2º Módulo",
    photo: "https://picsum.photos/seed/perfil/240/240",
    borrowedCount: 2,
    reviewsCount: 5,
    historyItems: [
      {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        status: "Devolvido",
        date: "25/05/2024",
      },
      {
        title: "1984",
        author: "George Orwell",
        status: "Devolvido",
        date: "10/05/2024",
      },
      {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        status: "Devolvido",
        date: "28/04/2024",
      },
      {
        title: "A Menina que Roubava Livros",
        author: "Markus Zusak",
        status: "Em andamento",
        date: "Devolver até: 20/06/2024",
      },
    ],
    reviewItems: [
      {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        date: "25/05/2024",
        rating: 4,
      },
      {
        title: "1984",
        author: "George Orwell",
        date: "10/05/2024",
        rating: 4,
      },
      {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        date: "28/04/2024",
        rating: 5,
      },
    ],
  },
};

export function isValidRm(value: string | null | undefined): boolean {
  return /^\d{5}$/.test((value ?? "").trim());
}

export async function getProfileByRm(rm: string): Promise<ProfileRecord | null> {
  if (!isValidRm(rm)) {
    return null;
  }

  try {
    const db = await getDatabase();
    const students = db.collection("students");
    const document = await students.findOne(
      { rm: Number(rm) },
      {
        projection: {
          _id: 0,
          name: 1,
          rm: 1,
          course: 1,
          photo: 1,
          borrowedCount: 1,
          reviewsCount: 1,
          historyItems: 1,
          reviewItems: 1,
        },
      },
    );

    if (document) {
      return {
        name: String(document.name),
        rm: String(document.rm),
        course: String(document.course),
        photo: String(document.photo ?? "https://picsum.photos/seed/perfil/240/240"),
        borrowedCount: Number(document.borrowedCount ?? 0),
        reviewsCount: Number(document.reviewsCount ?? 0),
        historyItems: Array.isArray(document.historyItems) ? document.historyItems : [],
        reviewItems: Array.isArray(document.reviewItems) ? document.reviewItems : [],
      };
    }
  } catch (error) {
    console.warn(
      "Não foi possível consultar o perfil no banco de dados. Usando dados locais.",
      error,
    );
  }

  return fallbackProfiles[rm] ?? null;
}
