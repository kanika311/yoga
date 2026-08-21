import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: String,
    quote: { type: String, required: true },
    image: String,
    country: String,
    rating: { type: Number, default: 5 },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
