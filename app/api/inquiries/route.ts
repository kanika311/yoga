import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const items = await Inquiry.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const item = await Inquiry.create(await req.json());
  return NextResponse.json({ message: "Thank you. We will reach out shortly.", item }, { status: 201 });
}
