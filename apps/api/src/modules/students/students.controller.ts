import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

import {
  StudentsService,
  type StudentResponse,
} from "./students.service";

@Controller("students")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class StudentsController {
  constructor(
    private readonly studentsService:
      StudentsService,
  ) {}

  @Post()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  create(
    @Body()
    createStudentDto:
      CreateStudentDto,
  ): Promise<StudentResponse> {
    return this.studentsService.create(
      createStudentDto,
    );
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  findAll(): Promise<
    StudentResponse[]
  > {
    return this.studentsService.findAll();
  }

  @Get("me")
  @Roles(UserRole.STUDENT)
  findMyProfile(
    @CurrentUser("id")
    userId: string,
  ): Promise<StudentResponse> {
    return this.studentsService.findMyProfile(
      userId,
    );
  }

  @Get(":id")
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  findOne(
    @Param("id") id: string,
  ): Promise<StudentResponse> {
    return this.studentsService.findOne(
      id,
    );
  }

  @Patch(":id")
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  update(
    @Param("id") id: string,

    @Body()
    updateStudentDto:
      UpdateStudentDto,
  ): Promise<StudentResponse> {
    return this.studentsService.update(
      id,
      updateStudentDto,
    );
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param("id") id: string,
  ): Promise<{
    message: string;
  }> {
    return this.studentsService.remove(
      id,
    );
  }
}