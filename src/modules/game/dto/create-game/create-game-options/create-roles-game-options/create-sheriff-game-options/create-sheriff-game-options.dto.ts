import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { SHERIFF_GAME_OPTIONS_API_PROPERTIES, SHERIFF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema.constants";
import { CreateSheriffElectionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-election-game-options.dto";

class CreateSheriffGameOptionsDto {
  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.isEnabled,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean = SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled.default;

  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.electedAt,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateSheriffElectionGameOptionsDto)
  @ValidateNested()
  public electedAt: CreateSheriffElectionGameOptionsDto = new CreateSheriffElectionGameOptionsDto();

  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.hasDoubledVote,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public hasDoubledVote: boolean = SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote.default;

  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.mustSettleTieInVotes,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public mustSettleTieInVotes: boolean = SHERIFF_GAME_OPTIONS_FIELDS_SPECS.mustSettleTieInVotes.default;
}

export { CreateSheriffGameOptionsDto };