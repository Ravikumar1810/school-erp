import { Global, Module } from "@nestjs/common";

import { DATABASE_CONNECTION } from "./database.constants";
import { db } from "./drizzle/drizzle";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useValue: db,
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}