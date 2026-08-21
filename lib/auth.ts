import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export function signToken(user: { _id: unknown; email: string; role: string; name: string }) {
  return jwt.sign(
    { id: String(user._id), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
}

export async function getAuth(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const bearer = headerStore.get("authorization");
  const token =
    cookieStore.get("token")?.value ||
    (bearer?.startsWith("Bearer ") ? bearer.slice(7) : null);

  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuth();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ message: "Not authorized" }, { status: 401 }),
    };
  }
  return { user, error: null };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
