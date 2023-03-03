import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("🐺 Root")
@Controller()
export class AppController {
  // eslint-disable-next-line class-methods-use-this
  @Get("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public root(): void {}
}