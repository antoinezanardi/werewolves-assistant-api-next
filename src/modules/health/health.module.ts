import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { DatabaseModule } from "@/modules/config/database/database.module";
import { HealthController } from "@/modules/health/controllers/health.controller";

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}