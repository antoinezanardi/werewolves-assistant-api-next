import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";

import { VOTE_ACTIONS, STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS, TARGET_ACTIONS } from "@/modules/game/constants/game-play/game-play.constant";
import { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";
import { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

class MakeGamePlayDto {
  @ApiProperty({ description: `Players affected by the play. Must be set when game's upcoming play action is one of the following : ${TARGET_ACTIONS.toString()}` })
  @IsOptional()
  @Type(() => MakeGamePlayTargetDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((target: MakeGamePlayTargetDto) => target.playerId, { message: "targets.playerId must be unique" })
  @Expose()
  public targets?: MakeGamePlayTargetDto[];

  @ApiProperty({ description: `Players votes. Must be set when game's upcoming play action is one of the following : ${VOTE_ACTIONS.toString()}` })
  @IsOptional()
  @Type(() => MakeGamePlayVoteDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((vote: MakeGamePlayVoteDto) => vote.sourceId, { message: "votes.sourceId must be unique" })
  @Expose()
  public votes?: MakeGamePlayVoteDto[];

  @ApiProperty({ description: `Can be set to \`true\` only if there is a \`stuttering judge\` in the game and the game's upcoming action is one of the following : ${STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS.toString()}. If set to \`true\`, there is another vote immediately` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public doesJudgeRequestAnotherVote?: boolean;

  @ApiProperty({ description: `Can be set when game's upcoming action is \`${GamePlayActions.CHOOSE_CARD}\`` })
  @IsOptional()
  @Type(() => String)
  @IsMongoId()
  @Expose()
  public chosenCardId?: Types.ObjectId;

  @ApiProperty({ description: `Side chosen by \`${RoleNames.DOG_WOLF}\`. Required when game's upcoming action is \`${GamePlayActions.CHOOSE_SIDE}\`` })
  @IsOptional()
  @IsEnum(RoleSides)
  @Expose()
  public chosenSide?: RoleSides;
}

export { MakeGamePlayDto };