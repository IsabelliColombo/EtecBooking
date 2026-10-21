import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashSessionToken, SESSION_COOKIE, type SessaoDocument } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      const database = await getDatabase();
      await database
        .collection<SessaoDocument>("sessoes")
        .deleteOne({ tokenHash: hashSessionToken(token) });
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
