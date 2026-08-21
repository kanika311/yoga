import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Blog from "@/models/Blog";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { slug } = await params;
  const item = await Blog.findOne({ slug, published: true });
  if (!item) return NextResponse.json({ message: "Article not found" }, { status: 404 });
  item.views += 1;
  await item.save();
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  const item = await Blog.findByIdAndUpdate(slug, await req.json(), { new: true });
  if (!item) return NextResponse.json({ message: "Article not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  await Blog.findByIdAndDelete(slug);
  return NextResponse.json({ message: "Deleted" });
}
