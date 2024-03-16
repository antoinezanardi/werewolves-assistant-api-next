import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";

import { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";
import { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

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

  @ApiProperty({ description: `Can be set to \`true\` only if current action is \`${GamePlayActions.REQUEST_ANOTHER_VOTE}\` . If set to \`true\`, there is another vote immediately` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public doesJudgeRequestAnotherVote?: boolean;

  @ApiProperty({ description: `Can be set when game's current action is \`${GamePlayActions.CHOOSE_CARD}\`` })
  @IsOptional()
  @Type(() => String)
  @IsMongoId()
  @Expose()
  public chosenCardId?: Types.ObjectId;

  @ApiProperty({ description: `Side chosen by \`${RoleNames.WOLF_HOUND}\`. Required when game's upcoming action is \`${GamePlayActions.CHOOSE_SIDE}\`` })
  @IsOptional()
  @IsEnum(RoleSides)
  @Expose()
  public chosenSide?: RoleSides;
}

export { MakeGamePlayDto };