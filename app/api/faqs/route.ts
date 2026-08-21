import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import FAQ from "@/models/FAQ";

export async function GET(req: NextRequest) {
  await connectDB();
  const filter: Record<string, unknown> = req.nextUrl.searchParams.get("all") === "1" ? {} : { published: true };
  const category = req.nextUrl.searchParams.get("category");
  if (category) filter.category = category;
  const items = await FAQ.find(filter).sort({ order: 1, createdAt: 1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const item = await FAQ.create(await req.json());
  return NextResponse.json(item, { status: 201 });
}
