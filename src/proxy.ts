import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();
  if (req.nextUrl.pathname === "/admin/entrar") return NextResponse.next();

  const user = req.auth?.user;
  if (!user || user.role !== "ADMIN") {
    const signInUrl = new URL("/admin/entrar", req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
