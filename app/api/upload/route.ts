import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";

import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(
  req: NextRequest
) {
  try {
    /**
     * Only authenticated admin
     * can upload images.
     */
    const { error } = await requireAuth();

    if (error) {
      return error;
    }

    const formData = await req.formData();

    const file = formData.get(
      "image"
    ) as File | null;

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
     * Validate image type.
     */
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          message:
            "Only image files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Maximum file size:
     * 5 MB
     */
    const MAX_FILE_SIZE =
      5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message:
            "Image size must be less than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Upload directory:
     *
     * public/uploads
     */
    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    /**
     * Create folder if it
     * does not exist.
     */
    if (
      !fs.existsSync(uploadDirectory)
    ) {
      fs.mkdirSync(
        uploadDirectory,
        {
          recursive: true,
        }
      );
    }

    /**
     * Get file extension.
     */
    let extension =
      path
        .extname(file.name)
        .toLowerCase();

    /**
     * Fallback extension.
     */
    if (!extension) {
      extension = ".jpg";
    }

    /**
     * Generate unique filename.
     */
    const filename =
      `${Date.now()}-` +
      `${crypto.randomUUID()}` +
      extension;

    /**
     * Convert file to Buffer.
     */
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    /**
     * Final file path.
     */
    const filePath =
      path.join(
        uploadDirectory,
        filename
      );

    /**
     * Save image.
     */
    fs.writeFileSync(
      filePath,
      buffer
    );

    /**
     * Public URL.
     */
    const url =
      `/uploads/${filename}`;

    return NextResponse.json({
      message:
        "Image uploaded successfully",

      url,
    });
  } catch (error) {
    console.error(
      "POST /api/upload error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Image upload failed",
      },
      {
        status: 500,
      }
    );
  }
}