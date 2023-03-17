import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";
import { API_RESOURCES } from "../../shared/api/enums/api.enum";

@ApiTags("❤️ Health")
@Controller(API_RESOURCES.HEALTH)
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