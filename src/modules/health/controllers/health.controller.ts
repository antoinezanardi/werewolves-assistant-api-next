import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";
import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";

import { ApiResources } from "@/shared/api/enums/api.enums";

@ApiTags("❤️ Health")
@Controller(ApiResources.HEALTH)
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get health's status of the API",
    description: "The health will be defined against the MongoDB connection instance",
  })
  @HealthCheck()
  private async check(): Promise<HealthCheckResult> {
    return this.health.check([async(): Promise<HealthIndicatorResult> => this.mongoose.pingCheck("mongoose")]);
  }
}