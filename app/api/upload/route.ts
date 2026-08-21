import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Authentication
    // --------------------------------------------------

    const { error } = await requireAuth();

    if (error) {
      return error;
    }

    // --------------------------------------------------
    // 2. Get form data
    // --------------------------------------------------

    const formData = await req.formData();

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "No image selected",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 3. Validate file type
    // --------------------------------------------------

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          message:
            "Only JPG, PNG, WEBP and GIF images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 4. Validate file size
    // --------------------------------------------------

    if (file.size <= 0) {
      return NextResponse.json(
        {
          message: "Invalid image file",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "Image size must be less than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 5. Upload directory
    // --------------------------------------------------

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    // Create directory if it doesn't exist
    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    // --------------------------------------------------
    // 6. Generate unique filename
    // --------------------------------------------------

    const filename =
      `${Date.now()}-${crypto.randomUUID()}${extension}`;

    // --------------------------------------------------
    // 7. Create file path
    // --------------------------------------------------

    const filePath = path.join(
      uploadDirectory,
      filename
    );

    // --------------------------------------------------
    // 8. Convert File -> Buffer
    // --------------------------------------------------

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // --------------------------------------------------
    // 9. Save image
    // --------------------------------------------------

    await fs.writeFile(filePath, buffer);

    // --------------------------------------------------
    // 10. Verify file exists
    // --------------------------------------------------

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        {
          message:
            "Image was uploaded but could not be verified",
        },
        {
          status: 500,
        }
      );
    }

    // --------------------------------------------------
    // 11. Public URL
    // --------------------------------------------------

    const url = `/uploads/${filename}`;

    // If you need complete URL:
    const origin = req.nextUrl.origin;

    const fullUrl = `${origin}${url}`;

    // --------------------------------------------------
    // 12. Response
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",

        filename,

        url,

        fullUrl,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed",
      },
      {
        status: 500,
      }
    );
  }
}