import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EnvModule } from "./config/env/env.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    EnvModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}