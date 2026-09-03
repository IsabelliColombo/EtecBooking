import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProfileByRm, isValidRm } from "@/lib/profile";

const SESSION_COOKIE = "etecbooking_session";

export async function GET() {
  const cookieStore = await cookies();
  const rm = cookieStore.get(SESSION_COOKIE)?.value;

  if (typeof rm !== "string" || !isValidRm(rm)) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const profile = await getProfileByRm(rm);

  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  return NextResponse.json(profile);
}
