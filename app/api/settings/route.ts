import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Settings from "@/models/Settings";

/**
 * GET SETTINGS
 *
 * Public API.
 * Used by frontend and admin settings page.
 */
export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: "MummaMove",

        tagline: "MummaMove",

        logo: "/logo.jpeg",

        social: {
          instagram: "",
          linkedin: "",
          youtube: "",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(
      "GET /api/settings error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch settings",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * UPDATE SETTINGS
 *
 * Admin authenticated API.
 */
export async function PUT(req: NextRequest) {
  try {
    const { error } = await requireAuth();

    if (error) {
      return error;
    }

    await connectDB();

    const body = await req.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        ...body,

        social: {
          instagram:
            body.social?.instagram || "",

          linkedin:
            body.social?.linkedin || "",

          youtube:
            body.social?.youtube || "",
        },
      });
    } else {
      settings.siteName =
        body.siteName ?? settings.siteName;

      settings.tagline =
        body.tagline ?? settings.tagline;

      settings.email =
        body.email ?? settings.email;

      settings.phone =
        body.phone ?? settings.phone;

      settings.whatsapp =
        body.whatsapp ?? settings.whatsapp;

      settings.address =
        body.address ?? settings.address;

      settings.about =
        body.about ?? settings.about;

      settings.founderName =
        body.founderName ??
        settings.founderName;

      settings.founderBio =
        body.founderBio ??
        settings.founderBio;

      settings.founderImage =
        body.founderImage ??
        settings.founderImage;

      settings.logo =
        body.logo ?? settings.logo;

      settings.bannerImage =
        body.bannerImage ??
        settings.bannerImage;

      settings.hours =
        body.hours ?? settings.hours;

      settings.social = {
        instagram:
          body.social?.instagram ??
          settings.social?.instagram ??
          "",

        linkedin:
          body.social?.linkedin ??
          settings.social?.linkedin ??
          "",

        youtube:
          body.social?.youtube ??
          settings.social?.youtube ??
          "",
      };

      await settings.save();
    }

    return NextResponse.json({
      message: "Settings saved successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "PUT /api/settings error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to save settings",
      },
      {
        status: 500,
      }
    );
  }
}