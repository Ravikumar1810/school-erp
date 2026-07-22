import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "./config/configuration";
import { validate } from "./config/env.validation";

import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";

import { TeachersModule } from "./modules/teachers/teachers.module";
import { StudentsModule } from "./modules/students/students.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { MarksModule } from "./modules/marks/marks.module";
import { UsersModule } from "./modules/users/users.module";
import { ProfileModule } from "./modules/profile/profile.module";
import {
  DashboardModule,
} from "./modules/dashboard/dashboard.module";
import {
  AnalyticsModule,
} from "./modules/analytics/analytics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env",
    load: [configuration],
    validate,
  }),

    DatabaseModule,

    AuthModule,

    TeachersModule,
    StudentsModule,
    AttendanceModule,
    MarksModule,
    UsersModule,
    ProfileModule,
    DashboardModule,
    AnalyticsModule,
    
  ],

})

export class AppModule {}