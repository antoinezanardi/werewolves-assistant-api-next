import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_RESOURCES } from "../../../shared/api/enums/api.enum";
import { ValidateMongoId } from "../../../shared/api/pipes/validate-mongo-id.pipe";
import { getControllerRouteError } from "../../../shared/error/helpers/error.helper";
import { CreateGameDto } from "../dto/create-game/create-game.dto";
import { GAME_STATUSES } from "../enums/game.enum";
import { GameService } from "../providers/game.service";
import { Game } from "../schemas/game.schema";
import { ApiGameIdParam } from "./decorators/api-game-id-param.decorator";
import { ApiGameNotFoundResponse } from "./decorators/api-game-not-found-response.decorator";

@ApiTags("🎲 Games")
@Controller(API_RESOURCES.GAMES)
export class GameController {
  public constructor(private readonly gameService: GameService) {}
  @Get()
  @ApiOperation({ summary: "Get games" })
  @ApiResponse({ status: HttpStatus.OK, type: Game, isArray: true })
  public async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a game by id" })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  @ApiGameNotFoundResponse()
  public async getGame(@Param("id", ValidateMongoId) id: string): Promise<Game> {
    try {
      return await this.gameService.getGameById(id);
    } catch (err) {
      throw getControllerRouteError(err);
    }
  }

  @Post()
  @ApiOperation({ summary: "Create a new game" })
  public async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel a playing game", description: `This endpoint won't delete the game, but set its status to ${GAME_STATUSES.CANCELED}. In this status, the game can't be mutated anymore.` })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: Game, description: `Game's status will be set to ${GAME_STATUSES.CANCELED}` })
  @ApiGameNotFoundResponse()
  public async cancelGame(@Param("id", ValidateMongoId) id: string): Promise<Game> {
    try {
      return await this.gameService.cancelGameById(id);
    } catch (err) {
      throw getControllerRouteError(err);
    }
  }
}