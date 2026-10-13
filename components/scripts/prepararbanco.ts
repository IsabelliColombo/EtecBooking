import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";

async function main() {
  const db = await getDatabase();

  // aluno com senha pronta para validar o login
  const senhaHash = await bcrypt.hash("senha123", 10);
  await db.collection("alunos").updateOne(
    { matricula: "25055" },
    {
      $set: {
        nome: "Isabelli Colombo",
        matricula: "25055",
        email: "aluno.25055@email.com",
        curso: "Desenvolvimento de Sistemas - 2º Módulo",
        senhaHash,
        ativo: true,
      },
    },
    { upsert: true }
  );

  console.log("Banco preparado.");
  console.log("Login de teste: RM 25055 | senha: senha123");
  process.exit(0);
}

main();
