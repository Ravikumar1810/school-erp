import Cookies from "js-cookie";

import api from "@/lib/axios";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "@/types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

class AuthService {
 
  async login(
    payload: LoginRequest,
  ): Promise<LoginResponse> {
    const { data } =
      await api.post<LoginResponse>(
        "/auth/login",
        payload,
      );

    this.setTokens(
      data.tokens.accessToken,
      data.tokens.refreshToken,
    );

    return data;
  }

 
  async getCurrentUser(): Promise<AuthUser> {
    const { data } =
      await api.get<AuthUser>(
        "/auth/me",
      );

    return data;
  }

 
  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<MessageResponse> {
    const { data } =
      await api.post<MessageResponse>(
        "/auth/forgot-password",
        {
          email:
            payload.email
              .trim()
              .toLowerCase(),
        },
      );

    return data;
  }


  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<MessageResponse> {
    const { data } =
      await api.post<MessageResponse>(
        "/auth/reset-password",
        payload,
      );

    return data;
  }


  async refreshTokens(): Promise<string> {
    const refreshToken =
      this.getRefreshToken();

    if (!refreshToken) {
      this.clearTokens();

      throw new Error(
        "Refresh token is not available.",
      );
    }

    const { data } =
      await api.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          refreshToken,
        },
      );

    this.setTokens(
      data.accessToken,
      data.refreshToken,
    );

    return data.accessToken;
  }

  
  async logout(): Promise<void> {
    try {
      const accessToken =
        this.getAccessToken();

      if (accessToken) {
        await api.post(
          "/auth/logout",
        );
      }
    } catch (error) {
      console.error(
        "Logout request failed:",
        error,
      );
    } finally {
      this.clearTokens();
    }
  }

 
  getAccessToken():
    | string
    | undefined {
    return Cookies.get(
      ACCESS_TOKEN_KEY,
    );
  }

 
  getRefreshToken():
    | string
    | undefined {
    return Cookies.get(
      REFRESH_TOKEN_KEY,
    );
  }

 
  isAuthenticated(): boolean {
    return Boolean(
      this.getAccessToken(),
    );
  }

  clearTokens(): void {
    Cookies.remove(
      ACCESS_TOKEN_KEY,
      {
        path: "/",
      },
    );

    Cookies.remove(
      REFRESH_TOKEN_KEY,
      {
        path: "/",
      },
    );
  }

  private setTokens(
    accessToken: string,
    refreshToken: string,
  ): void {
    Cookies.set(
      ACCESS_TOKEN_KEY,
      accessToken,
      this.getCookieOptions(1),
    );

    Cookies.set(
      REFRESH_TOKEN_KEY,
      refreshToken,
      this.getCookieOptions(7),
    );
  }

  private getCookieOptions(
    expires: number,
  ) {
    return {
      expires,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        "strict" as const,

      path: "/",
    };
  }
}

export const authService =
  new AuthService();