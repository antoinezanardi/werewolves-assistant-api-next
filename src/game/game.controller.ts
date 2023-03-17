import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_RESOURCES } from "../_shared/api/enums/api.enum";
import { ValidateMongoId } from "../_shared/api/pipes/validate-mongo-id.pipe";
import { getControllerRouteError } from "../_shared/error/helpers/error.helper";
import { CreateGameDto } from "./dto/create-game/create-game.dto";
import { GameService } from "./game.service";
import { Game } from "./schemas/game.schema";

@ApiTags("🎲 Games")
@Controller(API_RESOURCES.GAMES)
export class GameController {
  public constructor(private readonly gameService: GameService) {}
  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: Game, isArray: true })
  public async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Get(":id")
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  public async getGame(@Param("id", ValidateMongoId) id: string): Promise<Game> {
    try {
      return await this.gameService.getGameById(id);
    } catch (err) {
      throw getControllerRouteError(err);
    }
  }

  @Post()
  public async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }
}