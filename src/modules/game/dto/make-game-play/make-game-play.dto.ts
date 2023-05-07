import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { ROLE_NAMES, ROLE_SIDES } from "../../../role/enums/role.enum";
import { requiredTargetsActions, requiredVotesActions, stutteringJudgeRequestOpportunityActions } from "../../constants/game-play.constant";
import { GAME_PLAY_ACTIONS } from "../../enums/game-play.enum";
import { MakeGamePlayTargetDto } from "./make-game-play-target/make-game-play-target.dto";
import { MakeGamePlayVoteDto } from "./make-game-play-vote/make-game-play-vote.dto";

class MakeGamePlayDto {
  @ApiProperty({ description: `Players affected by the play. Must be set when game's upcoming play action is one of the following : ${requiredTargetsActions.toString()}` })
  @IsOptional()
  @Type(() => MakeGamePlayTargetDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((target: MakeGamePlayTargetDto) => target.playerId, { message: "targets.playerId must be unique" })
  @Expose()
  public targets?: MakeGamePlayTargetDto[];

  @ApiProperty({ description: `Players votes. Must be set when game's upcoming play action is one of the following : ${requiredVotesActions.toString()}` })
  @IsOptional()
  @Type(() => MakeGamePlayVoteDto)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((vote: MakeGamePlayVoteDto) => vote.sourceId, { message: "votes.sourceId must be unique" })
  @Expose()
  public votes?: MakeGamePlayVoteDto[];

  @ApiProperty({ description: `Can be set to \`true\` only if there is a \`stuttering judge\` in the game and the game's upcoming action is one of the following : ${stutteringJudgeRequestOpportunityActions.toString()}. If set to \`true\`, there is another vote immediately` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public doesJudgeRequestAnotherVote?: boolean;

  @ApiProperty({ description: `Can be set when game's upcoming action is \`${GAME_PLAY_ACTIONS.CHOOSE_CARD}\`` })
  @IsOptional()
  @Type(() => String)
  @IsMongoId()
  @Expose()
  public chosenCardId?: Types.ObjectId;

  @ApiProperty({ description: `Side chosen by \`${ROLE_NAMES.DOG_WOLF}\`. Required when game's upcoming action is \`${GAME_PLAY_ACTIONS.CHOOSE_SIDE}\`` })
  @IsOptional()
  @IsEnum(ROLE_SIDES)
  @Expose()
  public chosenSide?: ROLE_SIDES;
}

export { MakeGamePlayDto };