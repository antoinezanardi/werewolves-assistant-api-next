import { Module } from "@nestjs/common";

import { EnvModule } from "@/modules/config/env/env.module";
import { GameModule } from "@/modules/game/game.module";
import { HealthModule } from "@/modules/health/health.module";
import { RoleModule } from "@/modules/role/role.module";

import { AppController } from "@/app.controller";

@Module({
  imports: [
    EnvModule,
    HealthModule,
    RoleModule,
    GameModule,
  ],
  controllers: [AppController],
})
export class AppModule {}