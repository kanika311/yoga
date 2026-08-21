import mongoose, { Schema } from "mongoose";

const programSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    excerpt: String,
    description: String,
    image: String,
    icon: String,
    highlights: [String],
    benefits: [String],
    focusAreas: [String],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Program || mongoose.model("Program", programSchema);
