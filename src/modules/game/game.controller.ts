import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_RESOURCES } from "../../shared/api/enums/api.enum";
import { ValidateMongoId } from "../../shared/api/pipes/validate-mongo-id.pipe";
import { getControllerRouteError } from "../../shared/error/helpers/error.helper";
import { CreateGameDto } from "./dto/create-game/create-game.dto";
import { GAME_STATUSES } from "./enums/game.enum";
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

  @Delete(":id")
  @ApiOperation({ summary: "Cancel a playing game" })
  @ApiParam({ name: "id", description: "Game's Id. Must be a valid MongoId" })
  @ApiResponse({ status: HttpStatus.OK, type: Game, description: `Game's status will be set to ${GAME_STATUSES.CANCELED}` })
  public async cancelGame(@Param("id", ValidateMongoId) id: string): Promise<Game> {
    try {
      return await this.gameService.cancelGameById(id);
    } catch (err) {
      throw getControllerRouteError(err);
    }
  }
}