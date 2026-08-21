import mongoose from "mongoose";

const URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "";

const globalWithCache = global;

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (!URI) {
    throw new Error("MONGO_URI is not set");
  }

  const cache = globalWithCache.mongooseCache;

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);

    cache.promise = mongoose.connect(URI);
  }

  cache.conn = await cache.promise;

  return cache.conn;
}