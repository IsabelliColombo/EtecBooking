import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";

type AlunoDocument = {
  nome: string;
  matricula: string;
  email: string;
  senhaHash?: string;
  ativo: boolean;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const matricula = typeof body?.rm === "string" ? body.rm.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const senha = typeof body?.password === "string" ? body.password : "";

    if (!/^\d{5}$/.test(matricula)) {
      return NextResponse.json(
        { error: "O RM deve ter 5 dígitos." },
        { status: 400 }
      );
    }

    if (!email || senha.length < 8) {
      return NextResponse.json(
        { error: "Informe o e-mail e uma senha de pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const senhaHash = await bcrypt.hash(senha, 10);

    // só atualiza se RM e e-mail batem, o aluno está ativo e ainda não tem senha
    const resultado = await database
      .collection<AlunoDocument>("alunos")
      .updateOne(
        {
          matricula,
          email,
          ativo: true,
          senhaHash: { $exists: false },
        },
        { $set: { senhaHash } }
      );

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: "Não foi possível cadastrar a senha com esses dados." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no primeiro acesso:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao banco de dados." },
      { status: 503 }
    );
  }
}