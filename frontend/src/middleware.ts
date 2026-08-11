import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = req.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/register";
  const isProtected =
    path === "/message" ||
    path.startsWith("/message/") ||
    path === "/friends" ||
    path.startsWith("/friends/");

  // Authenticated → leave login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/news", req.url));
  }

  // Guest → cannot open messages/friends
  if (!token && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${path}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/message",
    "/message/:path*",
    "/friends",
    "/friends/:path*",
    "/login",
    "/register",
  ],
};
