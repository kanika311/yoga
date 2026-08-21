import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const globalWithCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = {
    conn: null,
    promise: null,
  };
}

const cached = globalWithCache.mongooseCache;

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define MONGO_URI in your environment variables"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}