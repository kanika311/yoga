import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Page from "@/models/Page";

export async function GET() {
  await connectDB();
  const items = await Page.find().sort({ slug: 1 });
  return NextResponse.json(items);
}
