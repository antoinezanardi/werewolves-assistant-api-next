import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { sheriffGameOptionsApiProperties } from "../../../../../schemas/game-options/constants/roles-game-options/sheriff-game-options/sheriff-game-options.constant";
import { CreateSheriffElectionGameOptionsDto } from "./create-sheriff-election-game-options.dto";

class CreateSheriffGameOptionsDto {
  @ApiProperty(sheriffGameOptionsApiProperties.isEnabled)
  @IsOptional()
  public isEnabled?: boolean;

  @ApiProperty(sheriffGameOptionsApiProperties.electedAt)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSheriffElectionGameOptionsDto)
  public electedAt?: CreateSheriffElectionGameOptionsDto;

  @ApiProperty(sheriffGameOptionsApiProperties.hasDoubledVote)
  @IsOptional()
  public hasDoubledVote?: boolean;
}

export { CreateSheriffGameOptionsDto };