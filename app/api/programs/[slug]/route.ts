import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Program from "@/models/Program";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;

    const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug };
    const item = await Program.findOne(query);

    if (!item) {
      return NextResponse.json({ message: "Program not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error("GET /api/programs/[slug] error:", err);
    return NextResponse.json({ message: "Failed to fetch program" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const { slug } = await params;
    const body = await req.json();

    const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug };
    const item = await Program.findOneAndUpdate(query, body, { new: true });

    if (!item) {
      return NextResponse.json({ message: "Program not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error("PUT /api/programs/[slug] error:", err);
    const message = err instanceof Error ? err.message : "Failed to update program";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const { slug } = await params;

    const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug };
    const deleted = await Program.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json({ message: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully", id: deleted._id });
  } catch (err) {
    console.error("DELETE /api/programs/[slug] error:", err);
    return NextResponse.json({ message: "Failed to delete program" }, { status: 500 });
  }
}
