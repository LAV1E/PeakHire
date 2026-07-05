import { NextResponse } from "next/server";

// Protected path prefixes that require authentication
const PROTECTED_PATHS = ["/candidate", "/recruiter", "/admin"];

// Paths accessible only when NOT authenticated
const AUTH_PATHS = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

// Role-to-path mapping for redirecting users to their correct section
const ROLE_PATHS = {
  candidate: "/candidate/dashboard",
  recruiter: "/recruiter/dashboard",
  admin: "/admin/dashboard",
};

// Role-protected path prefixes
const ROLE_PROTECTED = {
  candidate: ["/candidate"],
  recruiter: ["/recruiter"],
  admin: ["/admin"],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // The backend sets an HTTP-only "accessToken" cookie.
  // We check its presence in middleware for route guards.
  // We cannot read its value or validate it (HTTP-only), just its existence.
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticated = !!accessToken;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to home
  if (isAuthPage && isAuthenticated) {
    // We don't know the role in middleware (HTTP-only cookie value is hidden),
    // so redirect to root and let the home page handle role-based routing
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
