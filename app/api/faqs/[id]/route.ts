import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import FAQ from "@/models/FAQ";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { id } = await params;
  const item = await FAQ.findByIdAndUpdate(id, await req.json(), { new: true });
  if (!item) return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { id } = await params;
  await FAQ.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
