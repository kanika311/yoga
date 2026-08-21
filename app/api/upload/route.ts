import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";

import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    /**
     * Only authenticated admin can upload
     */
    const { error } = await requireAuth();

    if (error) {
      return error;
    }

    const formData = await req.formData();

    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          message: "No image selected",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Validate file type
     */
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          message: "Only image files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Maximum file size = 5 MB
     */
    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          message: "Image size must be less than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Upload directory
     */
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    /**
     * Create directory if doesn't exist
     */
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    /**
     * Get extension
     */
    const originalName = file.name;

    const extension =
      path.extname(originalName).toLowerCase() || ".jpg";

    /**
     * Generate unique filename
     */
    const filename =
      `${Date.now()}-${crypto.randomUUID()}` +
      extension;

    /**
     * Convert file to Buffer
     */
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /**
     * Save file
     */
    const filepath = path.join(
      uploadDir,
      filename
    );

    fs.writeFileSync(filepath, buffer);

    /**
     * Public URL
     */
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      message: "Image uploaded successfully",
      url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Image upload failed",
      },
      {
        status: 500,
      }
    );
  }
}