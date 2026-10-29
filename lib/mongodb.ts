import "server-only";

import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

// Keep the cache on globalThis so hot reloads in development do not open
// duplicate MongoDB connections.
const cached: MongooseCache = globalWithMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cached;

export async function connectToMongoDB(): Promise<Mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error(
      'Missing MONGODB_URI environment variable. Add it to your server environment or ".env.local".',
    );
  }

  if (!cached.promise) {
    // Cache the in-flight promise so parallel requests reuse one connection.
    cached.promise = mongoose.connect(mongodbUri, {
      bufferCommands: false,
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}

export default connectToMongoDB;
