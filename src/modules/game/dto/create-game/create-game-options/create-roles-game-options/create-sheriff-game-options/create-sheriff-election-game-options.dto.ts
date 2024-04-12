import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

import { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";
import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import { SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES, SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema.constants";

class CreateSheriffElectionGameOptionsDto {
  @ApiProperty({
    ...SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.turn,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.min)
  public turn: number = SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.default;

  @ApiProperty({
    ...SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.phaseName,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsIn(GAME_PHASE_NAMES)
  public phaseName: GamePhaseName = SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phaseName.default;
}

export { CreateSheriffElectionGameOptionsDto };