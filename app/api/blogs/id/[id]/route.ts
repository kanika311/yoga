import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Blog from "@/models/Blog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { id } = await params;
  const item = await Blog.findById(id);
  if (!item) return NextResponse.json({ message: "Article not found" }, { status: 404 });
  return NextResponse.json(item);
}
