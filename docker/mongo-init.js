const databaseName = "etecbooking";

const db = db.getSiblingDB(databaseName);

db.createCollection("books");
db.createCollection("reservations");

db.books.createIndex({ title: 1 });
db.books.createIndex({ author: 1 });
db.books.createIndex({ category: 1 });
db.books.createIndex({ available: 1 });

db.reservations.createIndex({ bookId: 1 });
db.reservations.createIndex({ userId: 1 });
db.reservations.createIndex({ status: 1 });
db.reservations.createIndex({ reservedAt: -1 });
db.reservations.createIndex({ bookId: 1, status: 1 });

db.books.insertMany([
  {
    id: "7",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasia",
    available: true,
    coverSeed: "hobbit",
    synopsis:
      "Bilbo Bolseiro parte em uma aventura inesperada ao lado de treze anões para recuperar o tesouro guardado pelo dragão Smaug.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    title: "Jogos Vorazes",
    author: "Suzanne Collins",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "jogos-vorazes",
    addedAt: new Date("2024-05-10T12:00:00.000Z"),
    synopsis:
      "Em um futuro distópico, Katniss Everdeen é forçada a participar de um cruel jogo televisivo de sobrevivência.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    title: "Em Chamas",
    author: "Suzanne Collins",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "em-chamas",
    addedAt: new Date("2024-05-08T12:00:00.000Z"),
    synopsis:
      "Katniss torna-se símbolo de resistência e precisa enfrentar novos desafios após vencer os Jogos Vorazes.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    title: "Maze Runner: Correr ou Morrer",
    author: "James Dashner",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Aventura"],
    available: true,
    coverSeed: "maze-runner",
    addedAt: new Date("2024-05-05T12:00:00.000Z"),
    synopsis:
      "Thomas acorda em um labirinto sem memórias e precisa descobrir como escapar com outros adolescentes.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    title: "Divergente",
    author: "Veronica Roth",
    category: "Ficção Científica",
    genres: ["Ficção Científica", "Romance"],
    available: true,
    coverSeed: "divergente",
    addedAt: new Date("2024-05-03T12:00:00.000Z"),
    synopsis:
      "Tris Prior descobre que não pertence a nenhuma facção em uma sociedade dividida e precisa esconder quem realmente é.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Literatura",
    available: true,
    coverSeed: "pequeno-principe",
    synopsis:
      "Um piloto perdido no deserto encontra um pequeno príncipe de outro planeta. Entre conversas poéticas e encontros simbólicos, a história reflete sobre amizade, amor e o que realmente importa na vida.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    category: "Ficção",
    available: true,
    coverSeed: "1984",
    synopsis:
      "Em uma sociedade totalitária onde o Estado controla pensamentos e memórias, Winston Smith começa a questionar o sistema e busca a liberdade em um mundo vigilado pelo Grande Irmão.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    category: "Literatura",
    available: true,
    coverSeed: "dom-casmurro",
    synopsis:
      "Bento Santiago relembra sua juventude e o casamento com Capitu, em uma narrativa marcada por ciúmes, dúvidas e o famoso mistério que divide leitores até hoje.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "A Metamorfose",
    author: "Franz Kafka",
    category: "Ficção",
    available: true,
    coverSeed: "metamorfose",
    synopsis:
      "Gregor Samsa acorda transformado em um inseto e precisa lidar com a reação da família e da sociedade diante de sua nova condição, em uma crítica à alienação humana.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    category: "Literatura",
    available: true,
    coverSeed: "cem-anos",
    synopsis:
      "A saga da família Buendía em Macondo narra gerações marcadas por amor, guerra, progresso e solidão, em um dos maiores clássicos do realismo mágico.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    category: "Fantasia",
    available: true,
    coverSeed: "senhor-aneis",
    synopsis:
      "Frodo Bolseiro embarca em uma jornada épica para destruir o Um Anel e impedir que o mal domine a Terra-média, acompanhado por aliados corajosos.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print(`MongoDB inicializado: banco "${databaseName}" com coleções books e reservations.`);
