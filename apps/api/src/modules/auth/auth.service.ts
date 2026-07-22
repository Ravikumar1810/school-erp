import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import {
  ConfigService,
} from "@nestjs/config";

import {
  JwtService,
} from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import {
  createHash,
  randomBytes,
} from "crypto";

import {
  UserRole,
} from "../../common/enums/user-role.enum";

import {
  MailService,
} from "../mail/mail.service";

import {
  UsersService,
} from "../users/users.service";

import {
  ForgotPasswordDto,
} from "./dto/forgot-password.dto";

import {
  LoginDto,
} from "./dto/login.dto";

import {
  ResetPasswordDto,
} from "./dto/reset-password.dto";

interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface MessageResponse {
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService:
      UsersService,

    private readonly jwtService:
      JwtService,

    private readonly configService:
      ConfigService,

    private readonly mailService:
      MailService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<LoginResponse> {
    const email =
      loginDto.email
        .trim()
        .toLowerCase();

    const user =
      await this.usersService
        .findByEmail(
          email,
        );

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password.",
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Your account is inactive. Please contact the administrator.",
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Invalid email or password.",
      );
    }

    const payload: TokenPayload = {
      sub:
        user.id,

      email:
        user.email,

      role:
        user.role as UserRole,
    };

    const tokens =
      await this.generateTokens(
        payload,
      );

    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    return {
      user:
        this.toAuthUser(
          user,
        ),

      tokens,
    };
  }

  async getCurrentUser(
    userId: string,
  ): Promise<AuthUser> {
    const user =
      await this.usersService
        .findById(
          userId,
        );

    if (
      !user ||
      !user.isActive
    ) {
      throw new UnauthorizedException(
        "User account was not found or is inactive.",
      );
    }

    return this.toAuthUser(
      user,
    );
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        "Refresh token is required.",
      );
    }

    const refreshSecret =
      this.configService
        .get<string>(
          "jwt.refreshSecret",
        );

    if (!refreshSecret) {
      throw new Error(
        "REFRESH_TOKEN_SECRET is not configured.",
      );
    }

    let payload:
      TokenPayload;

    try {
      payload =
        await this.jwtService
          .verifyAsync<TokenPayload>(
            refreshToken,
            {
              secret:
                refreshSecret,
            },
          );
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired refresh token.",
      );
    }

    const user =
      await this.usersService
        .findById(
          payload.sub,
        );

    if (
      !user ||
      !user.isActive ||
      !user.refreshToken
    ) {
      throw new UnauthorizedException(
        "Refresh token is no longer valid.",
      );
    }

    const isRefreshTokenValid =
      await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

    if (
      !isRefreshTokenValid
    ) {
      throw new UnauthorizedException(
        "Invalid refresh token.",
      );
    }

    const tokens =
      await this.generateTokens({
        sub:
          user.id,

        email:
          user.email,

        role:
          user.role as UserRole,
      });

    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    return tokens;
  }

  async logout(
    userId: string,
  ): Promise<MessageResponse> {
    await this.usersService
      .clearRefreshToken(
        userId,
      );

    return {
      message:
        "Logged out successfully.",
    };
  }

  async forgotPassword(
    forgotPasswordDto:
      ForgotPasswordDto,
  ): Promise<MessageResponse> {
    const email =
      forgotPasswordDto.email
        .trim()
        .toLowerCase();

    const user =
      await this.usersService
        .findByEmail(
          email,
        );

    const response:
      MessageResponse = {
        message:
          "If an account exists for this email, password reset instructions have been sent.",
      };

    /*
     * Always return the same response
     * for missing or inactive accounts.
     *
     * This prevents account enumeration.
     */
    if (
      !user ||
      !user.isActive
    ) {
      return response;
    }

    /*
     * Generate the raw token that will
     * be included in the email URL.
     */
    const resetToken =
      randomBytes(
        32,
      ).toString(
        "hex",
      );

    /*
     * Store only the SHA-256 hash
     * in PostgreSQL.
     */
    const hashedToken =
      this.hashResetToken(
        resetToken,
      );

    /*
     * Reset link expires in 15 minutes.
     */
    const expiresAt =
      new Date(
        Date.now() +
          15 *
            60 *
            1000,
      );

    await this.usersService
      .updatePasswordResetToken(
        user.id,
        hashedToken,
        expiresAt,
      );

    const frontendUrl =
      this.configService
        .get<string>(
          "FRONTEND_URL",
        );

    if (!frontendUrl) {
      throw new Error(
        "FRONTEND_URL is not configured.",
      );
    }

    const normalizedFrontendUrl =
      frontendUrl.replace(
        /\/+$/,
        "",
      );

    const resetUrl =
      `${normalizedFrontendUrl}/reset-password?token=${encodeURIComponent(
        resetToken,
      )}`;

    /*
     * Send the reset URL to the
     * user's registered email address.
     */
    await this.mailService
      .sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl,
      );

    return response;
  }

  async resetPassword(
    resetPasswordDto:
      ResetPasswordDto,
  ): Promise<MessageResponse> {
    const hashedToken =
      this.hashResetToken(
        resetPasswordDto.token,
      );

    const user =
      await this.usersService
        .findByValidPasswordResetToken(
          hashedToken,
        );

    if (
      !user ||
      !user.isActive
    ) {
      throw new BadRequestException(
        "Password reset link is invalid or has expired.",
      );
    }

    const isSamePassword =
      await bcrypt.compare(
        resetPasswordDto.newPassword,
        user.password,
      );

    if (isSamePassword) {
      throw new BadRequestException(
        "New password must be different from your current password.",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        resetPasswordDto.newPassword,
        12,
      );

    /*
     * resetPassword() also clears:
     *
     * passwordResetToken
     * passwordResetExpiresAt
     * refreshToken
     *
     * Therefore the reset URL cannot
     * be reused and previous refresh
     * sessions are invalidated.
     */
    await this.usersService
      .resetPassword(
        user.id,
        hashedPassword,
      );

    return {
      message:
        "Password has been reset successfully. You can now login with your new password.",
    };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken =
      await bcrypt.hash(
        refreshToken,
        10,
      );

    await this.usersService
      .updateRefreshToken(
        userId,
        hashedRefreshToken,
      );
  }

  private async generateTokens(
    payload:
      TokenPayload,
  ): Promise<AuthTokens> {
    const accessSecret =
      this.configService
        .get<string>(
          "jwt.secret",
        );

    const refreshSecret =
      this.configService
        .get<string>(
          "jwt.refreshSecret",
        );

    if (
      !accessSecret ||
      !refreshSecret
    ) {
      throw new Error(
        "JWT configuration is missing.",
      );
    }

    const [
      accessToken,
      refreshToken,
    ] =
      await Promise.all([
        this.jwtService
          .signAsync(
            payload,
            {
              secret:
                accessSecret,

              expiresIn:
                "1d",
            },
          ),

        this.jwtService
          .signAsync(
            payload,
            {
              secret:
                refreshSecret,

              expiresIn:
                "7d",
            },
          ),
      ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private hashResetToken(
    token: string,
  ): string {
    return createHash(
      "sha256",
    )
      .update(
        token,
      )
      .digest(
        "hex",
      );
  }

  private toAuthUser(
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar:
        string | null;
    },
  ): AuthUser {
    return {
      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role as UserRole,

      avatar:
        user.avatar,
    };
  }
}