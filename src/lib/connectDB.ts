import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

export default async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGO_URI);
}
