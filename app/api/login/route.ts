import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  type AlunoDocument,
  hashSessionToken,
  type SessaoDocument,
} from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import {
  clearLoginRateLimit,
  consumeLoginAttempt,
} from "@/lib/login-rate-limit";

// hash falso, usado para gastar o mesmo tempo quando o aluno não existe
const HASH_FALSO =
  "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const matricula = typeof body?.rm === "string" ? body.rm.trim() : "";
    const senha = typeof body?.password === "string" ? body.password : "";

    if (!/^\d{5}$/.test(matricula) || !senha) {
      return NextResponse.json(
        { error: "Matrícula e senha são obrigatórias." },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const rateLimit = await consumeLoginAttempt(matricula);

    const aluno = await database
      .collection<AlunoDocument>("alunos")
      .findOne({ matricula });

    // compara sempre, mesmo se o aluno não existir (evita revelar quem existe)
    const senhaOk = await bcrypt.compare(
      senha,
      aluno?.senhaHash ?? HASH_FALSO,
    );

    if (!aluno || !aluno.ativo || !aluno.senhaHash || !senhaOk) {
      if (rateLimit.limited) {
        return NextResponse.json(
          { error: "Muitas tentativas. Aguarde e tente novamente." },
          {
            status: 429,
            headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
          },
        );
      }

      return NextResponse.json(
        { error: "Matrícula ou senha inválidas." },
        { status: 401 },
      );
    }

    await clearLoginRateLimit(matricula);

    // O token bruto é enviado somente ao cookie; o banco recebe apenas o hash.
    const token = randomBytes(32).toString("hex");
    const expiraEm = new Date(Date.now() + SESSION_DURATION_MS);

    await database
      .collection<SessaoDocument>("sessoes")
      .insertOne({
        tokenHash: hashSessionToken(token),
        matricula: aluno.matricula,
        expiraEm,
      });

    const response = NextResponse.json({
      ok: true,
      aluno: {
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ao banco de dados." },
      { status: 503 },
    );
  }
}
