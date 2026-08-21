import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Settings from "@/models/Settings";

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const body = await req.json();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(body);
  } else {
    Object.assign(settings, body);
    await settings.save();
  }
  return NextResponse.json(settings);
}
