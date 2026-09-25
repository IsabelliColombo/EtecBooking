import { getCurrentAluno, type AlunoPublico } from "@/lib/auth";

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

export type ProfileFavoriteItem = {
  title: string;
  author: string;
  date: string;
};

export type ProfileRecord = {
  name: string;
  rm: string;
  email: string;
  course: string;
  photo: string;
  borrowedCount: number;
  reviewsCount: number;
  favoritesCount: number;
  historyItems: ProfileHistoryItem[];
  reviewItems: ProfileReviewItem[];
  favoriteItems: ProfileFavoriteItem[];
};

function toProfileRecord(aluno: AlunoPublico): ProfileRecord {
  return {
    name: aluno.nome,
    rm: aluno.matricula,
    email: aluno.email,
    course: aluno.curso,
    photo: aluno.foto,
    borrowedCount: 0,
    reviewsCount: 0,
    favoritesCount: 0,
    historyItems: [],
    reviewItems: [],
    favoriteItems: [],
  };
}

/** Perfil do aluno autenticado via cookie de sessão. */
export async function getCurrentProfile(): Promise<ProfileRecord | null> {
  const aluno = await getCurrentAluno();
  if (!aluno) {
    return null;
  }

  return toProfileRecord(aluno);
}
