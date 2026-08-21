import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema(
  {
    type: { type: String, enum: ["contact", "demo"], default: "contact" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    countryCode: { type: String, default: "+91" },
    timezone: String,
    program: String,
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
