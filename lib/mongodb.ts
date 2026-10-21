import { Collection, Db, MongoClient } from "mongodb";
import { createHash } from "node:crypto";

import type { BookDocument, ReservationDocument } from "@/lib/db/types";

declare global {
  var _mongoClientPromiseFast: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;
let indexesPromise: Promise<void> | undefined;

async function migrateLegacySessions(database: Db): Promise<void> {
  const sessions = database.collection("sessoes");
  const collectionExists = await database
    .listCollections({ name: "sessoes" }, { nameOnly: true })
    .hasNext();
  if (!collectionExists) return;

  const existingIndexes = await sessions.listIndexes().toArray();

  // Remove the old unique index before unsetting its field on migrated records.
  if (existingIndexes.some((index) => index.name === "token_1")) {
    await sessions.dropIndex("token_1");
  }

  const legacySessions = await sessions
    .find({ token: { $type: "string" } }, { projection: { token: 1 } })
    .toArray();

  for (const session of legacySessions) {
    if (typeof session.token !== "string") continue;

    const tokenHash = createHash("sha256").update(session.token).digest("hex");
    await sessions.updateOne(
      { _id: session._id, token: session.token },
      { $set: { tokenHash }, $unset: { token: "" } },
    );
  }
}

const mongoClientOptions = {
  serverSelectionTimeoutMS: 1500,
  connectTimeoutMS: 1500,
};

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing environment variable: MONGODB_URI");
  }

  return uri;
}

function getDbName() {
  return process.env.MONGODB_DB_NAME ?? "etecbooking";
}

function connect(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromiseFast) {
      const client = new MongoClient(uri, mongoClientOptions);
      global._mongoClientPromiseFast = client.connect().catch((error) => {
        global._mongoClientPromiseFast = undefined;
        throw error;
      });
    }

    return global._mongoClientPromiseFast;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, mongoClientOptions);
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await connect();
  const database = client.db(getDbName());

  if (!indexesPromise) {
    indexesPromise = (async () => {
      const sessions = database.collection("sessoes");
      await migrateLegacySessions(database);

      await Promise.all([
        sessions.createIndex({ expiraEm: 1 }, { expireAfterSeconds: 0 }),
        sessions.createIndex({ tokenHash: 1 }, { unique: true }),
        database
          .collection("alunos")
          .createIndex({ matricula: 1 }, { unique: true }),
        database
          .collection("login_rate_limits")
          .createIndex({ key: 1 }, { unique: true }),
        database
          .collection("login_rate_limits")
          .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        database
          .collection("favoritos")
          .createIndex({ userId: 1, bookId: 1 }, { unique: true }),
        database
          .collection("notificacoes")
          .createIndex(
            { userId: 1, bookId: 1 },
            {
              unique: true,
              partialFilterExpression: { status: "waiting" },
              name: "one_waiting_availability_notification_per_book_and_user",
            },
          ),
        database
          .collection("notificacoes")
          .createIndex({ userId: 1, status: 1, notifiedAt: -1 }),
      ]);
    })().catch((error) => {
      indexesPromise = undefined;
      throw error;
    });
  }

  await indexesPromise;
  return database;
}

export async function getBooksCollection(): Promise<Collection<BookDocument>> {
  const db = await getDatabase();
  return db.collection<BookDocument>("books");
}

export async function getReservationsCollection(): Promise<
  Collection<ReservationDocument>
> {
  const db = await getDatabase();
  return db.collection<ReservationDocument>("reservations");
}
