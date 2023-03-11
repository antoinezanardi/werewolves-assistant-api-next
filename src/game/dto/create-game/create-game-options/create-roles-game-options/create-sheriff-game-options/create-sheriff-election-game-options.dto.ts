import { IsOptional } from "class-validator";
import { GAME_PHASES } from "../../../../../enums/game.enum";

class CreateSheriffElectionGameOptionsDto {
  @IsOptional()
  public turn?: number;

  @IsOptional()
  public phase?: GAME_PHASES;
}

export { CreateSheriffElectionGameOptionsDto };