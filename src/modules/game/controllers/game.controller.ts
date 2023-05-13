import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { API_RESOURCES } from "../../../shared/api/enums/api.enum";
import { ValidateMongoId } from "../../../shared/api/pipes/validate-mongo-id.pipe";
import { CreateGameDto } from "../dto/create-game/create-game.dto";
import { GetGameRandomCompositionPlayerResponseDto } from "../dto/get-game-random-composition/get-game-random-composition-player-response/get-game-random-composition-player-response.dto";
import { GetGameRandomCompositionDto } from "../dto/get-game-random-composition/get-game-random-composition.dto";
import { MakeGamePlayDto } from "../dto/make-game-play/make-game-play.dto";
import { GAME_STATUSES } from "../enums/game.enum";
import { GameRandomCompositionService } from "../providers/services/game-random-composition.service";
import { GameService } from "../providers/services/game.service";
import { Game } from "../schemas/game.schema";
import { ApiGameIdParam } from "./decorators/api-game-id-param.decorator";
import { ApiGameNotFoundResponse } from "./decorators/api-game-not-found-response.decorator";

@ApiTags("🎲 Games")
@Controller(API_RESOURCES.GAMES)
export class GameController {
  public constructor(
    private readonly gameService: GameService,
    private readonly gameRandomCompositionService: GameRandomCompositionService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get games" })
  @ApiResponse({ status: HttpStatus.OK, type: Game, isArray: true })
  public async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Get("random-composition")
  @ApiOperation({ summary: "Get game random composition for given players" })
  @ApiResponse({ status: HttpStatus.OK, type: GetGameRandomCompositionPlayerResponseDto, isArray: true })
  public getGameRandomComposition(@Query() getGameRandomCompositionDto: GetGameRandomCompositionDto): GetGameRandomCompositionPlayerResponseDto[] {
    return this.gameRandomCompositionService.getGameRandomComposition(getGameRandomCompositionDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a game by id" })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  @ApiGameNotFoundResponse()
  public async getGame(@Param("id", ValidateMongoId) id: string): Promise<Game> {
    return this.gameService.getGameById(id);
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
  public async cancelGame(@Param("id", ValidateMongoId) id: Types.ObjectId): Promise<Game> {
    return this.gameService.cancelGameById(id);
  }

  @Post(":id/play")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Make a game play", description: `Make a play for a game with the \`${GAME_STATUSES.PLAYING}\` status. Body parameters fields are required or optional based on the upcoming game play.` })
  public async makeGamePlay(@Param("id", ValidateMongoId) id: Types.ObjectId, @Body() makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    return this.gameService.makeGamePlay(id, makeGamePlayDto);
  }
}