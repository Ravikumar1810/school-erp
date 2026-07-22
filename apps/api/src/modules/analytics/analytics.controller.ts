import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";

import {
  AnalyticsService,
} from "./analytics.service";

import {
  JwtAuthGuard,
} from "../../common/guards/jwt-auth.guard";

import {
  RolesGuard,
} from "../../common/guards/roles.guard";

import {
  Roles,
} from "../../common/decorators/roles.decorator";

import {
  UserRole,
} from "../../common/enums/user-role.enum";

@Controller("analytics")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AnalyticsController {
  constructor(
    private readonly analyticsService:
      AnalyticsService,
  ) {}

  @Get("super-admin")
  @Roles(
    UserRole.SUPER_ADMIN,
  )
  getSuperAdminAnalytics() {
    return this.analyticsService
      .getSuperAdminAnalytics();
  }
}