import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    mimeType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
