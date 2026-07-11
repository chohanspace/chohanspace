import { MongoClient, Db, ObjectId } from 'mongodb';

function normalizeMongoUri(value?: string): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  const cleaned = trimmed.replace(/^MONGODB_URI\s*=\s*/i, '').trim();
  return /^mongodb(?:\+srv)?:\/\//i.test(cleaned) ? cleaned : null;
}

function createStubDb(): Db {
  const collection = () => ({
    find: () => ({
      sort: () => ({
        toArray: async () => [],
      }),
      toArray: async () => [],
    }),
    findOne: async () => null,
    insertOne: async () => ({ insertedId: new ObjectId() }),
    updateOne: async () => ({ modifiedCount: 0 }),
    deleteOne: async () => ({ deletedCount: 0 }),
    updateMany: async () => ({ modifiedCount: 0 }),
    deleteMany: async () => ({ deletedCount: 0 }),
    replaceOne: async () => ({ modifiedCount: 0 }),
  });

  return { collection } as unknown as Db;
}

const uri = normalizeMongoUri(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB ?? 'chohanspace';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise = uri
  ? (global._mongoClientPromise ?? (global._mongoClientPromise = new MongoClient(uri).connect()))
  : undefined;

export async function getDb(): Promise<Db> {
  if (!uri || !clientPromise) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return createStubDb();
    }

    throw new Error('MongoDB is not configured. Set MONGODB_URI in your environment.');
  }

  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export function toObjectId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export function idQuery(id: string) {
  const objectId = toObjectId(id);
  return objectId ? { $or: [{ id }, { _id: objectId }] } : { id };
}
