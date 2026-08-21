import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: String,
    content: String,
    image: String,
    category: { type: String, default: "Wellness" },
    author: { type: String, default: "Heal-In Sutras" },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
