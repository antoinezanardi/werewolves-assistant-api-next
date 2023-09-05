import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

import { SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES, SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema.constant";
import { GamePhases } from "@/modules/game/enums/game.enum";

class CreateSheriffElectionGameOptionsDto {
  @ApiProperty({
    ...SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.turn,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.minimum)
  public turn: number = SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.default;

  @ApiProperty({
    ...SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.phase,
    required: false,
  })
  @IsOptional()
  @IsEnum(GamePhases)
  public phase: GamePhases = SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phase.default;
}

export { CreateSheriffElectionGameOptionsDto };