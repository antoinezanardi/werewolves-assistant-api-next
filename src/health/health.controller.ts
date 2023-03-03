import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";

@ApiTags("❤️ Health")
@Controller("health")
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  @Get("/")
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.health.check([async(): Promise<HealthIndicatorResult> => this.mongoose.pingCheck("mongoose")]);
  }
}