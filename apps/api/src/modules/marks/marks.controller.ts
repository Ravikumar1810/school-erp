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

import { CreateMarkDto } from "./dto/create-mark.dto";
import { UpdateMarkDto } from "./dto/update-mark.dto";

import {
  MarksService,
  type MarkResponse,
} from "./marks.service";

@Controller("marks")
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MarksController {
  constructor(
    private readonly marksService:
      MarksService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createMarkDto:
      CreateMarkDto,

    @CurrentUser("id")
    userId: string,
  ): Promise<MarkResponse> {
    return this.marksService.create(
      createMarkDto,
      userId,
    );
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
  )
  findAll(): Promise<
    MarkResponse[]
  > {
    return this.marksService.findAll();
  }

  @Get("me")
  @Roles(UserRole.STUDENT)
  findMyMarks(
    @CurrentUser("id")
    userId: string,
  ): Promise<
    MarkResponse[]
  > {
    return this.marksService.findMyMarks(
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
  ): Promise<MarkResponse> {
    return this.marksService.findOne(
      id,
    );
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id")
    id: string,

    @Body()
    updateMarkDto:
      UpdateMarkDto,

    @CurrentUser("id")
    userId: string,
  ): Promise<MarkResponse> {
    return this.marksService.update(
      id,
      updateMarkDto,
      userId,
    );
  }
}