import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";

import {
  DashboardService,
} from "./dashboard.service";

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
  CurrentUser,
} from "../../common/decorators/current-user.decorator";

import {
  UserRole,
} from "../../common/enums/user-role.enum";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

@Controller("dashboard")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class DashboardController {
  constructor(
    private readonly dashboardService:
      DashboardService,
  ) {}

  // =========================================================
  // SUPER ADMIN
  // GET /api/dashboard/super-admin
  // =========================================================

  @Get("super-admin")
  @Roles(
    UserRole.SUPER_ADMIN,
  )
  getSuperAdminDashboard() {
    return this.dashboardService
      .getSuperAdminDashboard();
  }

  // =========================================================
  // ADMIN
  // GET /api/dashboard/admin
  // =========================================================

  @Get("admin")
  @Roles(
    UserRole.ADMIN,
  )
  getAdminDashboard() {
    return this.dashboardService
      .getAdminDashboard();
  }

  // =========================================================
  // STUDENT
  // GET /api/dashboard/student
  // =========================================================

  @Get("student")
  @Roles(
    UserRole.STUDENT,
  )
  getStudentDashboard(
    @CurrentUser()
    user: AuthenticatedUser,
  ) {
    return this.dashboardService
      .getStudentDashboard(
        user.id,
      );
  }
}