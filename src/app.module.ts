import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EnvModule } from "./config/env/env.module";
import { HealthModule } from "./health/health.module";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
    EnvModule,
    HealthModule,
    RoleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}