import {
  NextRequest,
  NextResponse,
} from "next/server";

const LOGIN_PATH =
  "/login";

const DASHBOARD_ROUTES = [
  "/super-admin",
  "/admin",
  "/student",
];

export function proxy(
  request: NextRequest,
) {
  const {
    pathname,
  } = request.nextUrl;

  const accessToken =
    request.cookies.get(
      "accessToken",
    )?.value;

  const isDashboardRoute =
    DASHBOARD_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(
          `${route}/`,
        ),
    );

  if (
    isDashboardRoute &&
    !accessToken
  ) {
    const loginUrl =
      new URL(
        LOGIN_PATH,
        request.url,
      );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/student/:path*",
  ],
};