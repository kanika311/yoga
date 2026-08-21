import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Program from "@/models/Program";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { slug } = await params;
  const item = await Program.findOne({ slug });
  if (!item) return NextResponse.json({ message: "Program not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  const item = await Program.findByIdAndUpdate(slug, await req.json(), { new: true });
  if (!item) return NextResponse.json({ message: "Program not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  await Program.findByIdAndDelete(slug);
  return NextResponse.json({ message: "Deleted" });
}
