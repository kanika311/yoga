import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Page from "@/models/Page";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { slug } = await params;
  const item = await Page.findOne({ slug });
  if (!item) return NextResponse.json({ message: "Page not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  const item = await Page.findOneAndUpdate({ slug }, await req.json(), { new: true, upsert: true });
  return NextResponse.json(item);
}
