import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Defina MONGODB_URI no arquivo .env antes de preparar o banco.");
}

const client = new MongoClient(uri);

const seedBooks = [
  {
    id: "mock-1",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasia",
    available: true,
    coverSeed: "hobbit",
    synopsis:
      "Bilbo Bolseiro parte em uma aventura inesperada ao lado de treze anões para recuperar o tesouro guardado pelo dragão Smaug.",
  },
  {
    id: "nov-1",
    title: "Jogos Vorazes",
    author: "Suzanne Collins",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "jogos-vorazes",
    addedAt: new Date("2024-05-10T12:00:00.000Z"),
    synopsis:
      "Em um futuro distópico, Katniss Everdeen é forçada a participar de um cruel jogo televisivo de sobrevivência.",
  },
  {
    id: "nov-2",
    title: "Em Chamas",
    author: "Suzanne Collins",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "em-chamas",
    addedAt: new Date("2024-05-08T12:00:00.000Z"),
    synopsis:
      "Katniss torna-se símbolo de resistência e precisa enfrentar novos desafios após vencer os Jogos Vorazes.",
  },
  {
    id: "nov-3",
    title: "Maze Runner: Correr ou Morrer",
    author: "James Dashner",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "maze-runner",
    addedAt: new Date("2024-05-05T12:00:00.000Z"),
    synopsis:
      "Thomas acorda em um labirinto sem memórias e precisa descobrir como escapar com outros adolescentes.",
  },
  {
    id: "nov-4",
    title: "Divergente",
    author: "Veronica Roth",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Romance"],
    available: true,
    coverSeed: "divergente",
    addedAt: new Date("2024-05-03T12:00:00.000Z"),
    synopsis:
      "Tris Prior descobre que não pertence a nenhuma facção em uma sociedade dividida e precisa esconder quem realmente é.",
  },
];

try {
  await client.connect();
  const database = client.db(process.env.MONGODB_DB_NAME ?? "etecbooking");
  const booksCollection = database.collection("books");
  const reservationsCollection = database.collection("reservations");
  const now = new Date();

  for (const book of seedBooks) {
    const existing = await booksCollection.findOne({
      title: book.title,
      author: book.author,
    });

    if (!existing) {
      await booksCollection.insertOne({
        ...book,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  const allBooks = await booksCollection
    .find({}, { projection: { id: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray();
  const largestNumericId = allBooks.reduce((largest, book) => {
    const id = typeof book.id === "string" ? book.id : "";
    return /^\d+$/.test(id) ? Math.max(largest, Number(id)) : largest;
  }, 0);

  let nextId = largestNumericId + 1;
  for (const book of allBooks) {
    const previousId = typeof book.id === "string" ? book.id : "";
    if (/^\d+$/.test(previousId)) continue;

    const numericId = String(nextId++);
    await booksCollection.updateOne(
      { _id: book._id },
      { $set: { id: numericId, updatedAt: now } },
    );

    if (previousId) {
      await reservationsCollection.updateMany(
        { catalogBookId: previousId },
        { $set: { catalogBookId: numericId } },
      );
    }
  }

  console.log("Livros cadastrados e IDs numéricos sequenciais no MongoDB.");
} finally {
  await client.close();
}
