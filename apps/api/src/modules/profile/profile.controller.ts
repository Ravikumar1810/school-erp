import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "../../common/decorators/current-user.decorator";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

import {
  ProfileService,
  type ProfileResponse,
} from "./profile.service";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService:
      ProfileService,
  ) {}

  @Get("me")
  getMyProfile(
    @CurrentUser("id")
    userId: string,
  ): Promise<ProfileResponse> {
    return this.profileService.getMyProfile(
      userId,
    );
  }

  @Patch("me")
  updateMyProfile(
    @CurrentUser("id")
    userId: string,

    @Body()
    updateProfileDto:
      UpdateProfileDto,
  ): Promise<ProfileResponse> {
    return this.profileService.updateMyProfile(
      userId,
      updateProfileDto,
    );
  }

  @Patch("change-password")
  changePassword(
    @CurrentUser("id")
    userId: string,

    @Body()
    changePasswordDto:
      ChangePasswordDto,
  ): Promise<{
    message: string;
  }> {
    return this.profileService.changePassword(
      userId,
      changePasswordDto,
    );
  }
}