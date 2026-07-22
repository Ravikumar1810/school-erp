"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import Cookies from "js-cookie";

import {
  ShieldCheck,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/use-auth";

import {
  canAccessPath,
  getDashboardPathByRole,
} from "@/lib/auth";

interface AuthGuardProps {
  children:
    React.ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    getStoredUser,
    getCurrentUser,
    clearAuth,
  } = useAuth();

  const [
    isChecking,
    setIsChecking,
  ] = useState(true);

  const [
    isAuthorized,
    setIsAuthorized,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuthentication =
      async () => {
        setIsChecking(true);
        setIsAuthorized(false);

        const accessToken =
          Cookies.get(
            "accessToken",
          );

        if (!accessToken) {
          clearAuth();

          router.replace(
            "/login",
          );

          return;
        }

        try {
          let user =
            getStoredUser();

          /*
           * Always verify the user
           * against the backend.
           *
           * localStorage is only a
           * cache and must not be
           * trusted for authorization.
           */
          try {
            user =
              await getCurrentUser();
          } catch {
            /*
             * If /auth/me fails,
             * authentication is invalid
             * or the token could not be
             * refreshed.
             */
            clearAuth();

            router.replace(
              "/login",
            );

            return;
          }

          if (
            !mounted ||
            !user
          ) {
            return;
          }

          const hasAccess =
            canAccessPath(
              user,
              pathname,
            );

          if (!hasAccess) {
            router.replace(
              getDashboardPathByRole(
                user.role,
              ),
            );

            return;
          }

          setIsAuthorized(
            true,
          );
        } catch (error) {
          console.error(
            "Authentication check failed:",
            error,
          );

          clearAuth();

          router.replace(
            "/login",
          );
        } finally {
          if (mounted) {
            setIsChecking(
              false,
            );
          }
        }
      };

    void checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [
    pathname,
    router,
    getStoredUser,
    getCurrentUser,
    clearAuth,
  ]);

  if (
    isChecking ||
    !isAuthorized
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <ShieldCheck className="size-6 text-emerald-400" />
          </div>

          <div className="text-center">
            <p className="font-medium">
              Verifying access
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while
              we secure your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}