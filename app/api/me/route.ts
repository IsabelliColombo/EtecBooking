import { NextResponse } from "next/server";
import { getCurrentAluno } from "@/lib/auth";

export async function GET() {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  return NextResponse.json({
    nome: aluno.nome,
    matricula: aluno.matricula,
  });
}
