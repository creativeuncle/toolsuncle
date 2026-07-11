import mongoose from "mongoose";

let connected = false;

export async function connectDB() {
  if (connected) return;
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set — admin dashboard features will not work.");
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  connected = true;
  console.log("Connected to MongoDB");
}
