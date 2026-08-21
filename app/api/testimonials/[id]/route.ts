import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Testimonial from "@/models/Testimonial";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { id } = await params;
  const item = await Testimonial.findByIdAndUpdate(id, await req.json(), { new: true });
  if (!item) return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const { id } = await params;
  await Testimonial.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
