import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";

import { CreateTeacherDto } from "./dto/create-teacher.dto";

import {
  TeachersService,
  type TeacherResponse,
} from "./teachers.service";

@Controller("teachers")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles(UserRole.SUPER_ADMIN)
export class TeachersController {
  constructor(
    private readonly teachersService:
      TeachersService,
  ) {}

  @Post()
  create(
    @Body()
    createTeacherDto:
      CreateTeacherDto,
  ): Promise<TeacherResponse> {
    return this.teachersService.create(
      createTeacherDto,
    );
  }

  @Get()
  findAll(): Promise<
    TeacherResponse[]
  > {
    return this.teachersService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
  ): Promise<TeacherResponse> {
    return this.teachersService.findOne(
      id,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(
    @Param("id") id: string,
  ): Promise<{
    message: string;
  }> {
    return this.teachersService.remove(
      id,
    );
  }
}