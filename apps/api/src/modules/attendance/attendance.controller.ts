import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

import { UserRole } from "../../common/enums/user-role.enum";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";

import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

import {
  AttendanceService,
  type AttendanceResponse,
} from "./attendance.service";

@Controller("attendance")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AttendanceController {
  constructor(
    private readonly attendanceService:
      AttendanceService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createAttendanceDto:
      CreateAttendanceDto,

    @CurrentUser("id")
    userId: string,
  ): Promise<AttendanceResponse> {
    return this.attendanceService.create(
      createAttendanceDto,
      userId,
    );
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  findAll(): Promise<
    AttendanceResponse[]
  > {
    return this.attendanceService.findAll();
  }

  @Get("me")
  @Roles(UserRole.STUDENT)
  findMyAttendance(
    @CurrentUser("id")
    userId: string,
  ): Promise<
    AttendanceResponse[]
  > {
    return this.attendanceService.findMyAttendance(
      userId,
    );
  }

  @Get(":id")
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  findOne(
    @Param("id")
    id: string,
  ): Promise<AttendanceResponse> {
    return this.attendanceService.findOne(
      id,
    );
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id")
    id: string,

    @Body()
    updateAttendanceDto:
      UpdateAttendanceDto,

    @CurrentUser("id")
    userId: string,
  ): Promise<AttendanceResponse> {
    return this.attendanceService.update(
      id,
      updateAttendanceDto,
      userId,
    );
  }
}