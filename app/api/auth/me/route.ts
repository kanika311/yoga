import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;
  await connectDB();
  const full = await User.findById(user!.id).select("-password");
  return NextResponse.json({ user: full });
}
