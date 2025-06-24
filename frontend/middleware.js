// export { auth as middleware } from "./auth";

import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;
  console.log("pathname::", pathname);
  console.log("token::", token);
  if (!token && !["signin", "signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|signin|signup|_next/image|.*\\.png$).*)"],
};
