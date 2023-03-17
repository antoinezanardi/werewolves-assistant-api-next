import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("🐺 Root")
@Controller()
export class AppController {
  @Get("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public root(): void {}
}