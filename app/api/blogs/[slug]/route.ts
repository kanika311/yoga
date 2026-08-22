import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Blog from "@/models/Blog";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;
    let item = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      item = await Blog.findById(slug);
    }
    if (!item) {
      item = await Blog.findOne({ slug });
    }
    if (!item) return NextResponse.json({ message: "Article not found" }, { status: 404 });
    if (item.published) {
      item.views = (item.views || 0) + 1;
      await item.save().catch(() => {});
    }
    return NextResponse.json(item);
  } catch (error: any) {
    console.error("GET /api/blogs/[slug] error:", error);
    return NextResponse.json({ message: error?.message || "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();
    let item = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      item = await Blog.findByIdAndUpdate(slug, body, { new: true });
    } else {
      item = await Blog.findOneAndUpdate({ slug }, body, { new: true });
    }
    if (!item) return NextResponse.json({ message: "Article not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error: any) {
    console.error("PUT /api/blogs/[slug] error:", error);
    return NextResponse.json({ message: error?.message || "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  try {
    await connectDB();
    const { slug } = await params;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      await Blog.findByIdAndDelete(slug);
    } else {
      await Blog.findOneAndDelete({ slug });
    }
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("DELETE /api/blogs/[slug] error:", error);
    return NextResponse.json({ message: error?.message || "Failed to delete article" }, { status: 500 });
  }
}
