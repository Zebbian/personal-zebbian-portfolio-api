import mongoose from "mongoose";

const vlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    category: String,
    imageUrl: String, // Cloudinary URL
  },
  { timestamps: true },
);

export default mongoose.model("Vlog", vlogSchema);
