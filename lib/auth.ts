import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";

export const SESSION_COOKIE = "etecbooking_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 horas

export type AlunoDocument = {
  nome: string;
  matricula: string;
  email: string;
  senhaHash?: string;
  ativo: boolean;
  curso?: string;
  foto?: string;
};

export type SessaoDocument = {
  tokenHash: string;
  matricula: string;
  expiraEm: Date;
};

/** O token bruto fica somente no cookie do navegador; o Mongo guarda o SHA-256. */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type AlunoPublico = {
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  foto: string;
};

const FOTO_PADRAO = "https://picsum.photos/seed/perfil/240/240";

function toAlunoPublico(aluno: AlunoDocument): AlunoPublico {
  return {
    nome: aluno.nome,
    matricula: aluno.matricula,
    email: aluno.email,
    curso: aluno.curso?.trim() || "Curso não informado",
    foto: aluno.foto?.trim() || FOTO_PADRAO,
  };
}

/** Lê o cookie de sessão, valida no MongoDB e devolve o aluno logado. */
export async function getCurrentAluno(): Promise<AlunoPublico | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const database = await getDatabase();
  const agora = new Date();

  const sessao = await database.collection<SessaoDocument>("sessoes").findOne({
    tokenHash: hashSessionToken(token),
    expiraEm: { $gt: agora },
  });

  if (!sessao) {
    return null;
  }

  const aluno = await database.collection<AlunoDocument>("alunos").findOne({
    matricula: sessao.matricula,
    ativo: true,
  });

  if (!aluno) {
    return null;
  }

  return toAlunoPublico(aluno);
}
