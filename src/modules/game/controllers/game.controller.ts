import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ApiGameIdParam } from "@/modules/game/controllers/decorators/api-game-id-param.decorator";
import { ApiGameNotFoundResponse } from "@/modules/game/controllers/decorators/api-game-not-found-response.decorator";
import { GetGameByIdPipe } from "@/modules/game/controllers/pipes/get-game-by-id.pipe";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GetGameRandomCompositionPlayerResponseDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition-player-response/get-game-random-composition-player-response.dto";
import { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import { GAME_STATUSES } from "@/modules/game/enums/game.enum";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GameRandomCompositionService } from "@/modules/game/providers/services/game-random-composition.service";
import { GameService } from "@/modules/game/providers/services/game.service";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { Game } from "@/modules/game/schemas/game.schema";

import { API_RESOURCES } from "@/shared/api/enums/api.enum";

@ApiTags("🎲 Games")
@Controller(API_RESOURCES.GAMES)
export class GameController {
  public constructor(
    private readonly gameService: GameService,
    private readonly gameRandomCompositionService: GameRandomCompositionService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get games" })
  @ApiResponse({ status: HttpStatus.OK, type: Game, isArray: true })
  private async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Get("random-composition")
  @ApiOperation({ summary: "Get game random composition for given players" })
  @ApiResponse({ status: HttpStatus.OK, type: GetGameRandomCompositionPlayerResponseDto, isArray: true })
  private getGameRandomComposition(@Query() getGameRandomCompositionDto: GetGameRandomCompositionDto): GetGameRandomCompositionPlayerResponseDto[] {
    return this.gameRandomCompositionService.getGameRandomComposition(getGameRandomCompositionDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a game by id" })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  @ApiGameNotFoundResponse()
  private getGame(@Param("id", GetGameByIdPipe) game: Game): Game {
    return game;
  }

  @Post()
  @ApiOperation({ summary: "Create a new game" })
  private async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel a playing game", description: `This endpoint won't delete the game, but set its status to ${GAME_STATUSES.CANCELED}. In this status, the game can't be mutated anymore.` })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: Game, description: `Game's status will be set to ${GAME_STATUSES.CANCELED}` })
  @ApiGameNotFoundResponse()
  private async cancelGame(@Param("id", GetGameByIdPipe) game: Game): Promise<Game> {
    return this.gameService.cancelGame(game);
  }

  @Post(":id/play")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Make a game play", description: `Make a play for a game with the \`${GAME_STATUSES.PLAYING}\` status. Body parameters fields are required or optional based on the upcoming game play.` })
  private async makeGamePlay(@Param("id", GetGameByIdPipe) game: Game, @Body() makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    return this.gameService.makeGamePlay(game, makeGamePlayDto);
  }

  @Get(":id/history")
  @ApiOperation({ summary: "Get a game full history by id" })
  @ApiGameIdParam()
  @ApiResponse({ status: HttpStatus.OK, type: [GameHistoryRecord] })
  @ApiGameNotFoundResponse()
  private async getGameHistory(@Param("id", GetGameByIdPipe) game: Game): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordService.getGameHistory(game._id);
  }
}