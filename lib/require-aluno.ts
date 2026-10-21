import { redirect } from "next/navigation";
import { getCurrentAluno } from "@/lib/auth";
import { buildLoginHref } from "@/lib/auth-redirect";

/** Autoriza uma página do aluno somente com uma sessão válida no banco. */
export async function requireAluno(returnPath: string) {
  const aluno = await getCurrentAluno();

  if (!aluno) {
    redirect(buildLoginHref(returnPath));
  }

  return aluno;
}
