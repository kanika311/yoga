import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Program from "@/models/Program";

export async function PUT(req: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ message: "Invalid items array" }, { status: 400 });
    }

    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        Program.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    return NextResponse.json({ success: true, message: "Programs reordered successfully" });
  } catch (err) {
    console.error("PUT /api/programs/reorder error:", err);
    const message = err instanceof Error ? err.message : "Failed to reorder programs";
    return NextResponse.json({ message }, { status: 500 });
  }
}
