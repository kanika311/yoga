import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin-yoga/login")) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const login = new URL("/admin-yoga/login", request.url);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-yoga", "/admin-yoga/:path*"],
};
