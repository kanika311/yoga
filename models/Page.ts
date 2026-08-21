import mongoose, { Schema } from "mongoose";

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,
    sections: [{ heading: String, body: String, image: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", pageSchema);
