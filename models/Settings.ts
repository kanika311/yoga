import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  tagline: string;

  email: string;
  phone: string;
  whatsapp: string;
  address: string;

  about: string;

  founderName: string;
  founderBio: string;
  founderImage: string;

  logo: string;
  bannerImage: string;

  hours: string;

  social: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: "Mummy Move",
    },

    tagline: {
      type: String,
      default: "Yoga for a healthy life",
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

    logo: {
      type: String,
      default: "",
    },

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

      linkedin: {
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

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>(
    "Settings",
    settingsSchema
  );

export default Settings;