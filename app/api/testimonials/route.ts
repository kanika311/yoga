import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuth, requireAuth } from "@/lib/auth";
import Testimonial from "@/models/Testimonial";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAll = req.nextUrl.searchParams.get("all") === "1";

    if (isAll) {
      const auth = await getAuth();
      if (!auth) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
      }
      const items = await Testimonial.find({}).sort({ createdAt: -1 });
      return NextResponse.json(items);
    }

    // Public request: return only approved & published testimonials
    const items = await Testimonial.find({
      published: { $ne: false },
      status: { $nin: ["pending", "rejected"] },
    }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    return NextResponse.json({ message: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const auth = await getAuth();

    // If submitted by authenticated admin:
    if (auth) {
      const item = await Testimonial.create({
        name: body.name?.trim(),
        role: body.role?.trim() || "Prenatal Yoga Client",
        quote: body.quote?.trim(),
        image: body.image?.trim() || "",
        country: body.country?.trim() || "",
        email: body.email?.trim() || "",
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        published: body.published !== undefined ? Boolean(body.published) : true,
        status: body.status || (body.published !== false ? "approved" : "pending"),
        order: Number(body.order) || 0,
      });

      return NextResponse.json(item, { status: 201 });
    }

    // Public visitor submitting a review:
    if (!body.name?.trim() || !body.quote?.trim()) {
      return NextResponse.json(
        { message: "Name and review story are required." },
        { status: 400 }
      );
    }

    const ratingNum = Math.min(5, Math.max(1, Number(body.rating) || 5));

    const item = await Testimonial.create({
      name: body.name.trim(),
      role: body.role?.trim() || "MummaMove Student",
      quote: body.quote.trim(),
      image: body.image?.trim() || "",
      country: body.country?.trim() || "",
      email: body.email?.trim() || "",
      rating: ratingNum,
      published: false, // Must be approved by admin
      status: "pending", // Waiting for admin approval
      order: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for sharing your experience! Your review has been submitted and will appear on the website after admin approval.",
        id: item._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/testimonials error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit review";
    return NextResponse.json({ message }, { status: 500 });
  }
}
