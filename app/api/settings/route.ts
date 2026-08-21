import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Settings from "@/models/Settings";

/**
 * GET SETTINGS
 *
 * Public API
 * Used by frontend website and admin panel
 */
export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: "Heal-In Sutras",
        social: {
          instagram: "",
          facebook: "",
          youtube: "",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

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
 * Admin only
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
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);

      await settings.save();
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("PUT SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update settings",
      },
      {
        status: 500,
      }
    );
  }
}