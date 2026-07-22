import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";

import { MarksController } from "./marks.controller";
import { MarksService } from "./marks.service";

@Module({
  imports: [
    DatabaseModule,
  ],

  controllers: [
    MarksController,
  ],

  providers: [
    MarksService,
  ],

  exports: [
    MarksService,
  ],
})
export class MarksModule {}