import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { SHERIFF_GAME_OPTIONS_API_PROPERTIES, SHERIFF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.constant";
import { CreateSheriffElectionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-election-game-options.dto";

class CreateSheriffGameOptionsDto {
  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.isEnabled,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean = SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled.default;

  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.electedAt,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSheriffElectionGameOptionsDto)
  @ValidateNested()
  public electedAt: CreateSheriffElectionGameOptionsDto = new CreateSheriffElectionGameOptionsDto();

  @ApiProperty({
    ...SHERIFF_GAME_OPTIONS_API_PROPERTIES.hasDoubledVote,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public hasDoubledVote: boolean = SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote.default;
}

export { CreateSheriffGameOptionsDto };