import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Program from "@/models/Program";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const filter = req.nextUrl.searchParams.get("all") === "1" ? {} : { published: { $ne: false } };
    const items = await Program.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/programs error:", err);
    return NextResponse.json({ message: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ message: "Program title is required." }, { status: 400 });
    }

    let slug = body.slug?.trim()
      ? body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (!slug) {
      slug = `program-${Date.now()}`;
    }

    // Check slug uniqueness
    const existing = await Program.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Normalize arrays
    const toArray = (val: unknown) => {
      if (Array.isArray(val)) return val.map(String).filter(Boolean);
      if (typeof val === "string") return val.split("\n").map((s) => s.trim()).filter(Boolean);
      return [];
    };

    const item = await Program.create({
      title: body.title.trim(),
      slug,
      subtitle: body.subtitle?.trim() || "",
      excerpt: body.excerpt?.trim() || "",
      description: body.description?.trim() || "",
      image: body.image?.trim() || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
      icon: body.icon?.trim() || "",
      highlights: toArray(body.highlights),
      benefits: toArray(body.benefits),
      focusAreas: toArray(body.focusAreas),
      order: Number(body.order) || 0,
      published: body.published !== undefined ? Boolean(body.published) : true,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("POST /api/programs error:", err);
    const message = err instanceof Error ? err.message : "Failed to create program";
    return NextResponse.json({ message }, { status: 500 });
  }
}
