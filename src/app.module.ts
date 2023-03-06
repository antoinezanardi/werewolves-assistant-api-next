import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EnvModule } from "./config/env/env.module";
import { GameModule } from "./game/game.module";
import { HealthModule } from "./health/health.module";
import { RoleModule } from "./role/role.module";

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