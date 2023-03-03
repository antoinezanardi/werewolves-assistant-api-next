import { Module } from "@nestjs/common";
import { DatabaseModule } from "../config/database/database.module";
import { EnvModule } from "../config/env/env.module";

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
  ],
})
export class E2eTestModule {}