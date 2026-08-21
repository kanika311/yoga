import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    siteName: { type: String, default: "Heal-In Sutras" },
    tagline: String,
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
    about: String,
    founderName: String,
    founderBio: String,
    founderImage: String,
    hours: String,
    social: {
      instagram: String,
      facebook: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
