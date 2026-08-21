import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Testimonial from "@/models/Testimonial";

export async function GET(req: NextRequest) {
  await connectDB();
  const filter = req.nextUrl.searchParams.get("all") === "1" ? {} : { published: true };
  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const item = await Testimonial.create(await req.json());
  return NextResponse.json(item, { status: 201 });
}
