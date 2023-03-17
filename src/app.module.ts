import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EnvModule } from "./modules/config/env/env.module";
import { GameModule } from "./modules/game/game.module";
import { HealthModule } from "./modules/health/health.module";
import { RoleModule } from "./modules/role/role.module";

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