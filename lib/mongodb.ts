import { Collection, Db, MongoClient } from "mongodb";

import type { BookDocument, ReservationDocument } from "@/lib/db/types";

declare global {
  var _mongoClientPromiseFast: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

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
  return client.db(getDbName());
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
