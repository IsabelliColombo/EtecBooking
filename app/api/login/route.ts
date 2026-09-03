import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { isValidRm } from "@/lib/profile";
import { getDatabase } from "@/lib/mongodb";

type UserDocument = {
  rm: string;
  password: string;
};

const SESSION_COOKIE = "etecbooking_session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const rm = typeof body?.rm === "string" ? body.rm.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!isValidRm(rm) || password.length === 0) {
      return NextResponse.json(
        { error: "RM e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const user = await database
      .collection<UserDocument>("users")
      .findOne({ rm });

    if (!user) {
      return NextResponse.json(
        { error: "RM ou senha inválidos." },
        { status: 401 },
      );
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return NextResponse.json(
        { error: "RM ou senha inválidos." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set(SESSION_COOKIE, rm, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      {
        error:
          "Não foi possível conectar ao banco de dados. Tente novamente em instantes.",
      },
      { status: 503 },
    );
  }
}
