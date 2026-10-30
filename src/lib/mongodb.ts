import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

if (!dbName) {
  throw new Error("DB_NAME is missing");
}

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  client = global._mongoClient ?? new MongoClient(uri);

  if (!global._mongoClientPromise) {
    global._mongoClient = client;
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const db = client.db(dbName);

export { client, clientPromise };
