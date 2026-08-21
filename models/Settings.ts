import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;

  about?: string;

  founderName?: string;
  founderBio?: string;
  founderImage?: string;

  logo?: string;
  bannerImage?: string;

  hours?: string;

  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: "Heal-In Sutras",
    },

    tagline: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    founderName: {
      type: String,
      default: "",
    },

    founderBio: {
      type: String,
      default: "",
    },

    founderImage: {
      type: String,
      default: "",
    },

    // Website Logo
    logo: {
      type: String,
      default: "",
    },

    // Website Homepage Banner
    bannerImage: {
      type: String,
      default: "",
    },

    hours: {
      type: String,
      default: "",
    },

    social: {
      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", settingsSchema);