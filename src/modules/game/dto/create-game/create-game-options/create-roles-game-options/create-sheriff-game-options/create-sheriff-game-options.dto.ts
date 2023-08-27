import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { sheriffGameOptionsApiProperties, sheriffGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.constant";
import { CreateSheriffElectionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-election-game-options.dto";

class CreateSheriffGameOptionsDto {
  @ApiProperty({
    ...sheriffGameOptionsApiProperties.isEnabled,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean = sheriffGameOptionsFieldsSpecs.isEnabled.default;

  @ApiProperty({
    ...sheriffGameOptionsApiProperties.electedAt,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSheriffElectionGameOptionsDto)
  @ValidateNested()
  public electedAt: CreateSheriffElectionGameOptionsDto = new CreateSheriffElectionGameOptionsDto();

  @ApiProperty({
    ...sheriffGameOptionsApiProperties.hasDoubledVote,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public hasDoubledVote: boolean = sheriffGameOptionsFieldsSpecs.hasDoubledVote.default;
}

export { CreateSheriffGameOptionsDto };