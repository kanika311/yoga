import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, service: "healinsutras" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
