import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import User from "@/models/User";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (user!.id === id) {
      return NextResponse.json(
        { message: "You cannot delete your own currently logged-in admin account." },
        { status: 400 }
      );
    }

    await connectDB();
    const totalCount = await User.countDocuments();
    if (totalCount <= 1) {
      return NextResponse.json(
        { message: "Cannot delete the only remaining admin account." },
        { status: 400 }
      );
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Admin not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Admin account (${deleted.email}) deleted successfully.`,
    });
  } catch (err) {
    console.error("DELETE /api/admins/[id] error:", err);
    const message = err instanceof Error ? err.message : "Failed to delete admin.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
