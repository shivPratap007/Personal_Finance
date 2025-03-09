// lib/mongoose.js

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const cached = {
  connection: null,
  promise: null,
};

async function connectMongo() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI as string, opts);
  }

  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.connection;
}

export default connectMongo;
