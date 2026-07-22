"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

import {
  authService,
} from "@/services/auth.service";

import type {
  AuthUser,
} from "@/types/auth";

import {
  getDashboardPathByRole,
  isUserRole,
} from "@/lib/auth";

const ACCESS_TOKEN_KEY =
  "accessToken";

const REFRESH_TOKEN_KEY =
  "refreshToken";

const USER_KEY =
  "authUser";

export function useAuth() {
  const router = useRouter();

  const getStoredUser =
    useCallback(
      (): AuthUser | null => {
        if (
          typeof window ===
          "undefined"
        ) {
          return null;
        }

        const storedUser =
          localStorage.getItem(
            USER_KEY,
          );

        if (!storedUser) {
          return null;
        }

        try {
          const user =
            JSON.parse(
              storedUser,
            ) as AuthUser;

          if (
            !user ||
            !isUserRole(
              user.role,
            )
          ) {
            localStorage.removeItem(
              USER_KEY,
            );

            return null;
          }

          return user;
        } catch {
          localStorage.removeItem(
            USER_KEY,
          );

          return null;
        }
      },
      [],
    );

  const setStoredUser =
    useCallback(
      (user: AuthUser) => {
        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(user),
        );
      },
      [],
    );

  const clearAuth =
    useCallback(() => {
      Cookies.remove(
        ACCESS_TOKEN_KEY,
      );

      Cookies.remove(
        REFRESH_TOKEN_KEY,
      );

      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.removeItem(
          USER_KEY,
        );
      }
    }, []);

  const redirectByRole =
    useCallback(
      (
        role:
          | AuthUser["role"]
          | string,
      ) => {
        if (!isUserRole(role)) {
          router.replace(
            "/login",
          );

          return;
        }

        router.replace(
          getDashboardPathByRole(
            role,
          ),
        );
      },
      [router],
    );

    const getCurrentUser =
    useCallback(
        async (): Promise<AuthUser> => {
        const user =
            await authService.getCurrentUser();

        setStoredUser(user);

        return user;
        },
        [setStoredUser],
    );

  const logout =
    useCallback(async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error(
          "Logout request failed:",
          error,
        );
      } finally {
        clearAuth();

        router.replace(
          "/login",
        );

        router.refresh();
      }
    }, [
      clearAuth,
      router,
    ]);

  return {
    getStoredUser,
    setStoredUser,
    getCurrentUser,
    clearAuth,
    redirectByRole,
    logout,
  };
}