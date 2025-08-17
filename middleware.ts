import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin") {
    const auth = req.headers.get("authorization");
    if (auth) {
      const basic = auth.split(" ")[1] || "";
      const [user, pwd] = atob(basic).split(":");
      if (
        user === process.env.ADMIN_USER &&
        pwd === process.env.ADMIN_PASSWORD
      ) {
        return NextResponse.next();
      }
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=\"Secure Area\"",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};

