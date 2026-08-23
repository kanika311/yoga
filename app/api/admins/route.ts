import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectDB();
    const admins = await User.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (err) {
    console.error("GET /api/admins error:", err);
    return NextResponse.json({ message: "Failed to fetch admins." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { message: "An admin account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "New admin account created successfully!",
        admin: {
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admins error:", err);
    const message = err instanceof Error ? err.message : "Failed to create admin.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
