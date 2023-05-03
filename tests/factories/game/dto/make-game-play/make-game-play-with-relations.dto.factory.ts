import { plainToInstance } from "class-transformer";
import { MakeGamePlayWithRelationsDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play-with-relations.dto";

function createFakeMakeGamePlayWithRelationsDto(obj: Partial<MakeGamePlayWithRelationsDto> = {}, override: object = {}): MakeGamePlayWithRelationsDto {
  return plainToInstance(MakeGamePlayWithRelationsDto, {
    targets: obj.targets ?? undefined,
    votes: obj.votes ?? undefined,
    doesJudgeRequestAnotherVote: obj.doesJudgeRequestAnotherVote ?? undefined,
    chosenCard: obj.chosenCard ?? undefined,
    chosenSide: obj.chosenSide ?? undefined,
    ...override,
  });
}

export { createFakeMakeGamePlayWithRelationsDto };