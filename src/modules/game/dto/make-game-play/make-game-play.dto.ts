import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ArrayUnique, IsArray, IsBoolean, IsIn, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";

import { RoleSide } from "@/modules/role/types/role.types";
import { ROLE_SIDES } from "@/modules/role/constants/role.constants";
import { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";

class MakeGamePlayDto {
  @ApiProperty({ description: `Players affected by the play. Must be set when game's current play action is type "action"` })
  @IsOptional()
  @Type(() => MakeGamePlayTargetDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((target: MakeGamePlayTargetDto) => target.playerId, { message: "targets.playerId must be unique" })
  @Expose()
  public targets?: MakeGamePlayTargetDto[];

  @ApiProperty({ description: `Players votes. Must be set when game's current play is of type "vote"` })
  @IsOptional()
  @Type(() => MakeGamePlayVoteDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((vote: MakeGamePlayVoteDto) => vote.sourceId, { message: "votes.sourceId must be unique" })
  @Expose()
  public votes?: MakeGamePlayVoteDto[];

  @ApiProperty({ description: `Can be set to \`true\` only if current action is \`${"request-another-vote"}\` . If set to \`true\`, there is another vote immediately` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public doesJudgeRequestAnotherVote?: boolean;

  @ApiProperty({ description: `Can be set when game's current action is \`${"choose-card"}\`` })
  @IsOptional()
  @Type(() => String)
  @IsMongoId()
  @Expose()
  public chosenCardId?: Types.ObjectId;

  @ApiProperty({ description: `Side chosen by \`${"wolf-hound"}\`. Required when game's upcoming action is \`${"choose-side"}\`` })
  @IsOptional()
  @IsIn(ROLE_SIDES)
  @Expose()
  public chosenSide?: RoleSide;
}

export { MakeGamePlayDto };