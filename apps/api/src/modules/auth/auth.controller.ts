import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";

import {
  CurrentUser,
} from "../../common/decorators/current-user.decorator";

import {
  JwtAuthGuard,
} from "../../common/guards/jwt-auth.guard";

import type {
  AuthenticatedUser,
} from "./strategies/jwt.strategy";

import {
  AuthService,
  type AuthTokens,
  type AuthUser,
  type LoginResponse,
  type MessageResponse,
} from "./auth.service";

import {
  ForgotPasswordDto,
} from "./dto/forgot-password.dto";

import {
  LoginDto,
} from "./dto/login.dto";

import {
  ResetPasswordDto,
} from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(
    @Body()
    loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return this.authService
      .login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(
    @CurrentUser("id")
    userId: string,
  ): Promise<AuthUser> {
    return this.authService
      .getCurrentUser(
        userId,
      );
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body("refreshToken")
    refreshToken: string,
  ): Promise<AuthTokens> {
    return this.authService
      .refreshTokens(
        refreshToken,
      );
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser()
    user: AuthenticatedUser,
  ): Promise<MessageResponse> {
    return this.authService
      .logout(user.id);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body()
    forgotPasswordDto:
      ForgotPasswordDto,
  ): Promise<MessageResponse> {
    return this.authService
      .forgotPassword(
        forgotPasswordDto,
      );
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body()
    resetPasswordDto:
      ResetPasswordDto,
  ): Promise<MessageResponse> {
    return this.authService
      .resetPassword(
        resetPasswordDto,
      );
  }
}