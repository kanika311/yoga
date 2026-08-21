import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { setAuthCookie, signToken } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = signToken(user);
    await setAuthCookie(token);
    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
