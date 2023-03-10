import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateGameDto } from "./dto/create-game/create-game.dto";
import { GameService } from "./game.service";
import { Game } from "./schemas/game.schema";

@ApiTags("🎲 Games")
@Controller("games")
export class GameController {
  public constructor(private readonly gameService: GameService) {}
  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: Game, isArray: true })
  public async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Post()
  public async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }
}