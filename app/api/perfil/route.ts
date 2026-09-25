import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/profile";

export async function GET() {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o perfil." },
      { status: 503 },
    );
  }
}
