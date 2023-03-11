import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { CreateSheriffElectionGameOptionsDto } from "./create-sheriff-election-game-options.dto";

class CreateSheriffGameOptionsDto {
  @IsOptional()
  public isEnabled?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSheriffElectionGameOptionsDto)
  public electedAt?: CreateSheriffElectionGameOptionsDto;

  @IsOptional()
  public hasDoubledVote?: boolean;
}

export { CreateSheriffGameOptionsDto };