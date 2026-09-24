import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";

async function main() {
  const db = await getDatabase();

  // apaga sessões vencidas automaticamente
  await db
    .collection("sessoes")
    .createIndex({ expiraEm: 1 }, { expireAfterSeconds: 0 });

  // token único e RM único
  await db.collection("sessoes").createIndex({ token: 1 }, { unique: true });
  await db.collection("alunos").createIndex({ matricula: 1 }, { unique: true });

  // aluno de teste, SEM senha (ele cria a senha no primeiro acesso)
  await db.collection("alunos").updateOne(
    { matricula: "12345" },
    {
      $setOnInsert: {
        nome: "Aluno Teste",
        matricula: "12345",
        email: "aluno.teste@email.com",
        ativo: true,
      },
    },
    { upsert: true }
  );

  // aluno com senha pronta para validar o login
  const senhaHash = await bcrypt.hash("senha123", 10);
  await db.collection("alunos").updateOne(
    { matricula: "25055" },
    {
      $set: {
        nome: "Aluno Validação",
        matricula: "25055",
        email: "aluno.25055@email.com",
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
